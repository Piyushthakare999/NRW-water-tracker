import { useEffect, useState } from "react";
import ReactMapboxGl, { MapContext } from "react-mapbox-gl";
import { collection, onSnapshot } from "firebase/firestore";

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

// CSS
import "mapbox-gl/dist/mapbox-gl.css";
import "../Dashboard/Dashboard.css";

const locationNitRaipur = [81.60676103734937, 21.24796709166176];

const Dashboard = () => {
  const [graphConfigState, setGraphConfigState] = useState(null);

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
        const graphConfig = getGraphConfig(adminData, intermediateData);
        graphConfig.size = {
          consumer: 130,
          distributer: 180,
        };

        setGraphConfigState(graphConfig);
        // console.log('graph config', graphConfig);
      });
    });
  }, []);

  return (
    <div className="dashboard-wrapper columns">
      <div className="main--map">
        {graphConfigState && (
          <Map
            // eslint-disable-next-line
            style="mapbox://styles/mapbox/streets-v9"
            containerStyle={{
              height: "100vh",
              width: "100%",
            }}
            zoom={[15]}
            center={locationNitRaipur}
          >
            <MapContext.Consumer>
              {(map) => {
                map.addImage(
                  "pulsing-dot-distributor",
                  pulsingDotDistributor(map, graphConfigState),
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

                for (const [, value] of Object.entries(
                  graphConfigState.nodes
                )) {
                  const { location, type, name } = value;
                  addPointToMap(map, location, type, name);
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
    </div>
  );
};

export default Dashboard;
