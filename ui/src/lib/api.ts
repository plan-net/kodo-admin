import Promise from 'bluebird';
import nodesData from '@/data/nodes.json';
import nodeDetailsData from '@/data/node-details.json';
import requestsData from '@/data/requests.json';
import statsData from '@/data/stats.json';
import userData from '@/data/user.json';
import notificationsData from '@/data/notifications.json';
import logsData from '@/data/logs.json'
import outputsData from '@/data/outputs.json';

export const api = {
  // Get list of all nodes with basic info
  getNodes: () => 
    Promise.delay(500).then(() => nodesData),
  
  // Get detailed data for a specific node
  getNodeDetails: (nodeId: string) =>
    Promise.delay(700).then(() => {
      const details = (nodeDetailsData as any)[nodeId];
      if (!details) {
        throw new Error(`Node ${nodeId} not found`);
      }
      return details;
    }),
  
  getRequestsData: () =>
    Promise.delay(700).then(() => requestsData),
  
  getStatsData: () =>
    Promise.delay(600).then(() => statsData),
  
  getCurrentUser: () =>
    Promise.delay(300).then(() => userData.authenticated),
    
  getNotifications: () =>
    Promise.delay(400).then(() => ({
      notifications: notificationsData.notifications,
      unreadCount: notificationsData.unreadCount
    })),
    
  markNotificationAsRead: (notificationId: string) =>
    Promise.delay(300).then(() => ({ success: true })),
    
  markAllNotificationsAsRead: () =>
    Promise.delay(300).then(() => ({ success: true })),
    
  // Get logs for a specific node
  getNodeLogs: (nodeId: string) =>
    Promise.delay(600).then(() => {
      const logs = (logsData as any)[nodeId];
      if (!logs) {
        throw new Error(`Logs for node ${nodeId} not found`);
      }
      return logs;
    }),
  
  // Get output data for a specific node
  getNodeOutput: (nodeId: string) =>
    Promise.delay(600).then(() => {
      const output = (outputsData as any)[nodeId];
      if (!output) {
        throw new Error(`Output for node ${nodeId} not found`);
      }
      return output;
    }),
}; 