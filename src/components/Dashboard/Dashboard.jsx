import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMapboxGl, { MapContext } from "react-mapbox-gl";
import { collection, onSnapshot } from "firebase/firestore";
import axios from "axios";
import swal from "sweetalert";

import { db } from "../../utils/firebase-config";
import {
  addEdgeToGraph,
  addPointToMap,
  getIntermediateGraph,
  getGraphConfig,
} from "../../utils/map-data";
import {
  pulsingDotDistributor,
  pulsingDotConsumer,
} from "../../utils/marker-styles";

// Components
import Details from "./Details";

// CSS
import "mapbox-gl/dist/mapbox-gl.css";
import "./Dashboard.css";

const sendAlert = async (storageData) => {
  const msg =
    "ALERT!! %0ALimit Exceeded. %0A" +
    storageData.name +
    " has threshold of " +
    storageData.threshold +
    " Ltrs and the current consumption is " +
    storageData.currentConsumed +
    " Ltrs. %0APlease check http://" +
    window.location.host +
    "/dashboard/id_11" +
    " for maintenance.";

  console.log(msg);

  const baseURL =
    "https://www.fast2sms.com/dev/bulkV2?authorization=" +
    process.env.REACT_APP_MESSAGE_API_TOKEN +
    "&message=" +
    msg +
    "&language=english&route=q&numbers=" +
    storageData.officeNumber;

  try {
    const res = await axios.get(baseURL);
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};

const checkAlert = (adminData) => {
  const exceedValues = [];
  for (const [, value] of Object.entries(adminData)) {
    if (value.threshold * 1.2 <= value.currentConsumed) {
      sendAlert(value);
      exceedValues.push(value);
    }
  }

  return exceedValues;
};

const Dashboard = () => {
  const [centerLocation, setCenterLocation] = useState([
    81.60676103734937, 21.24796709166176,
  ]);
  const [intermediateDataState, setIntermediateDataState] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [adminDetails, setAdminDetails] = useState(null);
  const [details, setDetails] = useState({
    name: "Main Supply",
    threshold: 200,
    averagePerDay: 160,
    currentConsumed: 5000,
    revenueMonthly: 4000,
    nonRevenueMonthly: 1000,
  });
  const [graphConfigState, setGraphConfigState] = useState(null);
  const { unitId } = useParams();

  const Map = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
  });

  useEffect(() => {
    const routesCollection = collection(db, "routes");
    onSnapshot(routesCollection, (snap) => {
      snap.docs.forEach((doc) => {
        const adminData = doc.data();
        const intermediateData = getIntermediateGraph(adminData);
        // console.log('intermeditate data', intermediateData);
        setIntermediateDataState(intermediateData);
        const graphConfig = getGraphConfig(adminData, intermediateData);
        graphConfig.size = {
          consumer: 130,
          distributer: 180,
        };

        setGraphConfigState(graphConfig);
        // console.log('graph config', graphConfig);

        setAdminDetails(adminData);
        if (unitId) {
          setDetails({ ...adminData[unitId], keyId: unitId });
          showDetails();
        } else {
          console.log("CHECKING EXCEEDED");
          const exceedValues = checkAlert(adminData);
          if (exceedValues.length) {
            swal({
              title: "Limit Exceeded!",
              text: `Exceeded at ${exceedValues[0].name}`,
              icon: "error",
              button: "Okay",
            });
          }
        }
      });
    });
    // eslint-disable-next-line
  }, []);

  const closeSideBar = () => {
    setIsSidebarOpen(false);
    setIsDetailsOpen(false);
  };

  const showSidebar = (key) => {
    setIsSidebarOpen(true);
    setIsDetailsOpen(false);

    if (!key) return;

    setDetails({ ...adminDetails[key], keyId: key });
  };

  const showDetails = () => {
    setIsSidebarOpen(false);
    setIsDetailsOpen(true);
  };

  const setNewCenter = (location) => {
    setCenterLocation(location);
  };

  return (
    <div className="dashboard-wrapper">
      <div>
        {graphConfigState && intermediateDataState && (
          <Map
            // eslint-disable-next-line
            style="mapbox://styles/mapbox/streets-v9"
            containerStyle={{
              height: "100vh",
              width: "100%",
            }}
            zoom={[15]}
            center={centerLocation}
          >
            <MapContext.Consumer>
              {(map) => {
                map.addImage(
                  "pulsing-dot-distributor-LOW",
                  pulsingDotDistributor(0.9, map, graphConfigState),
                  {
                    pixelRatio: 2,
                  }
                );
                map.addImage(
                  "pulsing-dot-distributor-MEDIUM",
                  pulsingDotDistributor(0.75, map, graphConfigState),
                  {
                    pixelRatio: 2,
                  }
                );
                map.addImage(
                  "pulsing-dot-distributor-HIGH",
                  pulsingDotDistributor(0, map, graphConfigState),
                  {
                    pixelRatio: 2,
                  }
                );
                map.addImage(
                  "pulsing-dot-consumer",
                  pulsingDotConsumer(map, graphConfigState),
                  {
                    pixelRatio: 2,
                  }
                );

                for (const [key, value] of Object.entries(
                  graphConfigState.nodes
                )) {
                  const { location, type, name } = value;
                  addPointToMap(
                    map,
                    key,
                    location,
                    type,
                    name,
                    intermediateDataState,
                    showSidebar,
                    setNewCenter
                  );
                }

                graphConfigState.edges.forEach((edge) => {
                  const { from, to, color } = edge;
                  addEdgeToGraph(
                    map,
                    graphConfigState.nodes[from].location,
                    graphConfigState.nodes[to].location,
                    color
                  );
                });
              }}
            </MapContext.Consumer>
          </Map>
        )}
      </div>
      <Details
        isSidebarOpen={isSidebarOpen}
        isDetailsOpen={isDetailsOpen}
        closeSideBar={closeSideBar}
        showDetails={showDetails}
        showSidebar={showSidebar}
        {...details}
      />
    </div>
  );
};

export default Dashboard;
