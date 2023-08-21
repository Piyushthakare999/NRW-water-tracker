const getColor = (ratio) => {
  if (ratio >= 0.9) return "green";
  if (ratio >= 0.75) return "yellow";
  return "red";
};

export const getIntermediateGraph = (adminData) => {
  const intermediateData = {};
  // make place for parents
  for (const [key, value] of Object.entries(adminData)) {
    const { type, rate } = value;
    if (type === "DISTRIBUTER") {
      intermediateData[key] = {
        rate,
        children: {},
      };
    }
  }

  // add children data
  for (const [key, value] of Object.entries(adminData)) {
    const { rate, parent } = value;
    if (parent) {
      intermediateData[parent].children[key] = rate;
    }
  }

  return intermediateData;
};

export const getGraphConfig = (adminData, intermediateData) => {
  const graphConfig = {
    nodes: {},
    edges: [],
  };
  for (const [key] of Object.entries(adminData)) {
    const { name, type, location } = adminData[key];
    graphConfig.nodes[key] = {
      name,
      type,
      location,
    };
  }

  for (const [parentKey, parentValue] of Object.entries(intermediateData)) {
    const rateSent = parentValue.rate;
    let rateReceived = 0;
    for (const [, childValue] of Object.entries(parentValue.children)) {
      rateReceived += childValue;
    }
    const lossRatio = rateReceived / rateSent;
    // console.log("loss = ", lossRatio, rateSent, rateReceived, "parent = ", [
    //   parentKey,
    //   parentValue,
    // ]);

    for (const [childKey] of Object.entries(parentValue.children)) {
      graphConfig.edges.push({
        from: parentKey,
        to: childKey,
        color: getColor(lossRatio),
      });
    }
  }

  return graphConfig;
};

export const addEdgeToGraph = async (
  myMap,
  fromLocation,
  toLocation,
  color
) => {
  const uniqueId = `EDGE ${fromLocation} - ${toLocation}`;
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  const url = `https://api.mapbox.com/directions/v5/mapbox/cycling/${fromLocation[0]},${fromLocation[1]};${toLocation[0]},${toLocation[1]}?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}&geometries=geojson`;
  const intermediatePoints = [];
  const response = await fetch(url, requestOptions);
  const result = await response.json();
  result.routes[0].geometry.coordinates.forEach((location) =>
    intermediatePoints.push(location)
  );
  setTimeout(() => {}, 300);

  myMap.addSource(uniqueId, {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [...intermediatePoints, toLocation],
      },
    },
  });
  myMap.addLayer({
    id: uniqueId,
    type: "line",
    source: uniqueId,
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": color,
      "line-width": 3,
    },
  });
};

export const addPointToMap = (
  myMap,
  key,
  location,
  type,
  title,
  intermediateDataState,
  showSidebar,
  setNewCenter
) => {
  const uniqueId = `POINT - ${location}`;
  myMap.addSource(uniqueId, {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            title: title,
          },
          geometry: {
            type: "Point",
            coordinates: location, // icon position [lng, lat]
          },
        },
      ],
    },
  });

  if (type === "CONSUMER") {
    myMap.addLayer({
      id: uniqueId,
      type: "symbol",
      source: uniqueId,
      layout: {
        "icon-image": "pulsing-dot-consumer",
        "text-field": ["get", "title"],
        "text-offset": [0, 1.25],
        "text-anchor": "top",
        "text-size": 10,
        "icon-allow-overlap": true,
        //'text-allow-overlap' :true,
        "icon-ignore-placement": true,
        //'text-ignore-placement':true
      },
    });
  } else {
    const ratio = getRatio(intermediateDataState[key]);
    const threat = getThreat(ratio);
    myMap.addLayer({
      id: uniqueId,
      type: "symbol",
      source: uniqueId,
      layout: {
        "icon-image": `pulsing-dot-distributor-${threat}`,
        "text-field": ["get", "title"],
        "text-offset": [0, 1.25],
        "text-anchor": "top",
        "text-size": 10,
        "icon-allow-overlap": true,
        //'text-allow-overlap' :true,
        "icon-ignore-placement": true,
        //'text-ignore-placement':true
      },
    });
  }

  myMap.on("click", uniqueId, (e) => {
    setNewCenter([location[0] + 0.005, location[1]]);
    showSidebar(key);
  });
};

const getThreat = (ratio) => {
  if (ratio >= 0.9) return "LOW";
  if (ratio >= 0.75) return "MEDIUM";
  return "HIGH";
};

const getRatio = (parentObject) => {
  const rateSent = parentObject.rate;
  let rateReceived = 0;
  for (const [, childValue] of Object.entries(parentObject.children)) {
    rateReceived += childValue;
  }
  const lossRatio = rateReceived / rateSent;
  return lossRatio;
};

// export const graphConfig = {
// 	nodes: {
// 		id_1: {
// 			name: 'Storage Tank 1',
// 			type: 'DISTRIBUTER',
// 			location: [81.60020112126455, 21.252931951393396],
// 		},
// 		id_2: {
// 			name: 'Science College',
// 			type: 'CONSUMER',
// 			location: [81.60213769615038, 21.247746351982528],
// 		},
// 		id_3: {
// 			name: 'NIT Raipur',
// 			type: 'CONSUMER',
// 			location: [81.60503448188233, 21.249926229557413],
// 		},
// 		id_4: {
// 			name: 'Pt. Ravishankar University',
// 			type: 'CONSUMER',
// 			location: [81.59740438151687, 21.24719369185602],
// 		},
// 		id_5: {
// 			name: 'Anupam Garden',
// 			type: 'CONSUMER',
// 			location: [81.6094778239714, 21.24444189976652],
// 		},
// 		id_6: {
// 			name: 'Disha College',
// 			type: 'CONSUMER',
// 			location: [81.61217539122049, 21.252119137746092],
// 		},
// 		id_7: {
// 			name: 'Sarawati Nagar Station',
// 			type: 'CONSUMER',
// 			location: [81.60427434747515, 21.25231754176621],
// 		},
// 		id_8: {
// 			name: 'Shree Khatu Sham Mandir',
// 			type: 'CONSUMER',
// 			location: [81.61762101951886, 21.24571792060598],
// 		},
// 		id_9: {
// 			name: 'Gaytri Mandir',
// 			type: 'CONSUMER',
// 			location: [81.61923034492548, 21.248397802445716],
// 		},
// 		id_10: {
// 			name: 'LifeWorth Hospital',
// 			type: 'CONSUMER',
// 			location: [81.61781413857244, 21.246537889599832],
// 		},
// 		id_11: {
// 			name: 'Storage Tank 2',
// 			type: 'DISTRIBUTER',
// 			location: [81.61238534753156, 21.245497928116794],
// 		},
// 	},
// 	edges: [
// 		{
// 			from: 'id_1',
// 			to: 'id_2',
// 			color: 'yellow',
// 		},
// 		{
// 			from: 'id_1',
// 			to: 'id_3',
// 			color: 'red',
// 		},
// 		{
// 			from: 'id_1',
// 			to: 'id_4',
// 			color: 'green',
// 		},
// 		{
// 			from: 'id_1',
// 			to: 'id_5',
// 			color: 'yellow',
// 		},
// 		{
// 			from: 'id_1',
// 			to: 'id_6',
// 			color: 'green',
// 		},
// 		{
// 			from: 'id_1',
// 			to: 'id_7',
// 			color: 'green',
// 		},
// 		{
// 			from: 'id_11',
// 			to: 'id_8',
// 			color: 'yellow',
// 		},
// 		{
// 			from: 'id_11',
// 			to: 'id_9',
// 			color: 'green',
// 		},
// 		{
// 			from: 'id_11',
// 			to: 'id_10',
// 			color: 'green',
// 		},
// 	],
// 	size: {
// 		consumer: 130,
// 		distributer: 180,
// 	},
// };
