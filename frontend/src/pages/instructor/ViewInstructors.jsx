import { useEffect, useState } from "react";
import api from "../../services/api";

const ViewInstructors = () => {
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    api.get("/").then(res => setInstructors(res.data));
  }, []);

  return (
    <div className="main-layout">
      <h2>Instructor Directory</h2>
      <div className="grid-container">
        {instructors.map(inst => (
          <div key={inst._id} className="dashboard-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👤</div>
            <h3 style={{ margin: '0' }}>{inst.name}</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{inst.email}</p>
            <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '4px 8px', borderRadius: '12px' }}>
              Instructor ID: {inst._id.substring(0, 8)}...
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewInstructors;