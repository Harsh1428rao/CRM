import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommunicationLogList = ({ campaignId, token }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campaignId) return;
    setLoading(true);
    axios.get(`/api/communication-logs?campaignId=${campaignId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setLogs(res.data))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [campaignId, token]);

  if (loading) return <div>Loading logs...</div>;
  if (!logs.length) return <div>No logs found.</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>Customer</th>
          <th>Email</th>
          <th>Message</th>
          <th>Status</th>
          <th>Delivery Time</th>
        </tr>
      </thead>
      <tbody>
        {logs.map(log => (
          <tr key={log._id}>
            <td>{log.customerId?.name}</td>
            <td>{log.customerId?.email}</td>
            <td>{log.message}</td>
            <td>{log.status}</td>
            <td>{log.deliveryTime ? new Date(log.deliveryTime).toLocaleString() : '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CommunicationLogList; 