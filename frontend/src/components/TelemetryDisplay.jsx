const TelemetryDisplay = ({ data }) => {
  if (!data) return <div>Loading telemetry data...</div>;

  return (
    <div className="telemetry-display">
      <div className="telemetry-card">
        <strong>Temperature:</strong> {data.temperature} °C
      </div>
      <div className="telemetry-card">
        <strong>Pressure:</strong> {data.pressure} hPa
      </div>
      <div className="telemetry-card">
        <strong>Humidity:</strong> {data.humidity} %
      </div>
      <div className="telemetry-card">
        <strong>Location:</strong> {data.location.lat}, {data.location.lon}
      </div>
    </div>
  );
};

export default TelemetryDisplay;