import React, { useState, useEffect } from "react";

const NodeInfo = () => {
  const [nodeInfo, setNodeInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/getinfo`);
      const data = await response.json();
      setNodeInfo(data.data);
    };

    fetchData();
  }, []);

  return (
    <div className="text-xl">
      {nodeInfo ? (
        nodeInfo.map((info) => (
          <div className="max-w-full" key={info}>
            <span className="font-bold">Node URI</span>
            <br />
            {info}
          </div>
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default NodeInfo;
