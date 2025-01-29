import Promise from 'bluebird';
import nodesData from '@/data/nodes.json';
import nodeDetailsData from '@/data/node-details.json';
import requestsData from '@/data/requests.json';
import statsData from '@/data/stats.json';
import userData from '@/data/user.json';
import notificationsData from '@/data/notifications.json';
import logsData from '@/data/logs.json'
import outputsData from '@/data/outputs.json';
import flowsData from '@/data/flows.json';
import Fuse from 'fuse.js';
import {client, flowsFlows} from "../../ui/src/lib/gen-api";

const reg_url = process.env.NEXT_PUBLIC_REGISTRY_URL || 'http://localhost:3367'

console.log('env.REGISTRY_URL :' + reg_url)
console.log('reg_url :', reg_url)

client.setConfig({
    baseUrl:reg_url,
})

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

  // Get list of all flows
  getFlows: () =>
    Promise.delay(0).then(async () => {

        // todo: to get mocks comment these 2 lines
        const resp = await flowsFlows()
        const flowsData = resp.data;

      const flowsWithLogsAndRequests = flowsData.items.map(flow => ({
        ...flow,
        logs: [
          {
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            level: 'info',
            message: `Flow "${flow.name}" executed successfully`,
          },
          {
            timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
            level: 'warning',
            message: 'Resource utilization above 80%',
          },
          {
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            level: 'error',
            message: 'Connection timeout during external API call',
          },
          {
            timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
            level: 'info',
            message: 'Starting flow execution',
          }
        ],
        requests: [
          {
            id: `req-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            user: 'Alice Johnson',
            role: 'Developer',
            input: 'Analyze customer sentiment from social media posts',
            inputTokens: 245,
            output: 'Sentiment analysis complete: 70% positive, 20% neutral, 10% negative',
            outputTokens: 178,
            status: 'Completed',
            kind: 'Batch Processing'
          },
          {
            id: `req-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            user: 'Bob Smith',
            role: 'Analyst',
            input: 'Generate quarterly sales report',
            inputTokens: 156,
            output: 'Report generated with 3 key insights',
            outputTokens: 312,
            status: 'Completed',
            kind: 'Report Generation'
          },
          {
            id: `req-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
            user: 'Carol White',
            role: 'Manager',
            input: 'Optimize marketing campaign parameters',
            inputTokens: 189,
            output: 'Campaign parameters optimized for maximum ROI',
            outputTokens: 234,
            status: 'Running',
            kind: 'Optimization'
          },
          {
            id: `req-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
            user: 'David Chen',
            role: 'Data Scientist',
            input: 'Train customer churn prediction model',
            inputTokens: 278,
            output: 'Model training in progress...',
            outputTokens: 89,
            status: 'Running',
            kind: 'Model Training'
          },
          {
            id: `req-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            user: 'Eva Martinez',
            role: 'Engineer',
            input: 'Debug API integration workflow',
            inputTokens: 167,
            output: 'Error identified in authentication module',
            outputTokens: 145,
            status: 'Failed',
            kind: 'Debugging'
          }
        ],
        output: `Output for ${flow.name}:\n\nAnalysis complete:\n- Processing time: 1.2s\n- Confidence score: 0.95\n- Key findings: Successfully processed with optimal parameters`,
        flowSteps: [
          '1. Initializing flow components...',
          '2. Loading input data...',
          '3. Preprocessing data structures...',
          '4. Applying transformation rules...',
          '5. Validating output format...',
          '6. Generating final response...',
          '7. Cleanup and resource release'
        ],
        status: {
          running: Math.random() > 0.5,
          step: Math.floor(Math.random() * 7) + 1,
          totalSteps: 7
        }
      }));

      return {
        total: flowsData.items.length,
        filtered: flowsData.items.length,
        items: flowsWithLogsAndRequests
      };
    }),

  // Get all unique tags from flows
  getAllFlowTags: () =>
    Promise.delay(300).then(() => {
      const allTags = flowsData.items.reduce((tags: string[], flow) => {
        return [...tags, ...flow.tags];
      }, []);
      // Remove duplicates and sort alphabetically
      return [...new Set(allTags)].sort();
    }),

  // Search flows with fuzzy matching
  searchFlows: (query: string) =>
    Promise.delay(400).then(() => {
      const options = {
        keys: ['name', 'description', 'tags', 'author', 'organization'],
        threshold: 0.4,
        includeScore: true
      };

      const fuse = new Fuse(flowsData.items, options);
      const searchResults = fuse.search(query);
      const items = searchResults.map(result => result.item);
      
      return {
        total: flowsData.items.length, // Total should be all possible items
        filtered: items.length,        // Filtered is the search results
        items: items
      };
    }),

  // Pin a flow by its URL
  pinFlow: (flowUrl: string) =>
    Promise.delay(300).then(() => {
      const pinnedFlows = JSON.parse(localStorage.getItem('pinnedFlows') || '[]');
      if (!pinnedFlows.includes(flowUrl)) {
        pinnedFlows.push(flowUrl);
        localStorage.setItem('pinnedFlows', JSON.stringify(pinnedFlows));
      }
      return { success: true };
    }),

  // Unpin a flow by its URL
  unpinFlow: (flowUrl: string) =>
    Promise.delay(300).then(() => {
      const pinnedFlows = JSON.parse(localStorage.getItem('pinnedFlows') || '[]');
      const updatedFlows = pinnedFlows.filter((url: string) => url !== flowUrl);
      localStorage.setItem('pinnedFlows', JSON.stringify(updatedFlows));
      return { success: true };
    }),

  // Get all pinned flows
  getPinnedFlows: () =>
    Promise.delay(300).then(() => {
      const pinnedUrls = JSON.parse(localStorage.getItem('pinnedFlows') || '[]');
      const pinnedFlows = flowsData.items.filter(flow => pinnedUrls.includes(flow.url));
      return {
        total: pinnedFlows.length,
        items: pinnedFlows
      };
    }),

  // Check if a flow is pinned
  isFlowPinned: (flowUrl: string) =>
    Promise.delay(300).then(() => {
      const pinnedFlows = JSON.parse(localStorage.getItem('pinnedFlows') || '[]');
      return pinnedFlows.includes(flowUrl);
    }),
}; 