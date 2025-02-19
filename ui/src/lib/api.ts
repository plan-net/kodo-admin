import Promise from 'bluebird';
import nodesData from '@/data/nodes.json';
import nodeDetailsData from '@/data/node-details.json';
import requestsData from '@/data/requests.json';
import statsData from '@/data/stats.json';
import userData from '@/data/user.json';
import notificationsData from '@/data/notifications.json';
import logsData from '@/data/logs.json'
import outputsData from '@/data/outputs.json';
import Fuse from 'fuse.js';
import { client, flowsFlows } from "./gen-api";


async function fetchRegUrl(): Promise<string> {
  const response = await fetch('/api/registry');
  const data = await response.json();
  return data.registry_url;
}


const reg_url = process.env.REGISTRY_URL || await fetchRegUrl();
client.setConfig({
  baseUrl: reg_url,
});

const flowsData = {
  items: [] // Initialize empty, will be populated from API
};


client.interceptors.request.use(async (request, options) => {
  if (typeof window === 'undefined') {
    return request;
  }
  const response = await fetch('/api/token?audience=kodosumi-service', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }
  )
  const token = (await response.json())
  request.headers.set('Authorization', 'Bearer ' + token.access_token);
  return request;
});

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
      const resp = await fetch(`${reg_url}/flows`);
      const flows = await resp.json();

      const flowsWithLogsAndRequests = flows.items.map(flow => ({
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

      // Update the flowsData.items for other functions to use
      flowsData.items = flows.items;

      return {
        total: flows.items.length,
        filtered: flows.items.length,
        items: flowsWithLogsAndRequests
      };
    }),

  getFlowInstances: () =>
    Promise.delay(0).then(async () => {
      const resp = await fetch(`${reg_url}/flow`);
      const data = await resp.json();
      return {
        result: data.result,
        total: data.total,
        p: data.p,
        pp: data.pp
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
      console.log('Pinning flow:', flowUrl);
      const pinnedFlows = JSON.parse(localStorage.getItem('pinnedFlows') || '[]');
      if (!pinnedFlows.includes(flowUrl)) {
        pinnedFlows.push(flowUrl);
        localStorage.setItem('pinnedFlows', JSON.stringify(pinnedFlows));
        console.log('Successfully pinned flow:', flowUrl);
      } else {
        console.log('Flow already pinned:', flowUrl);
      }
      return { success: true };
    }),

  // Unpin a flow by its URL
  unpinFlow: (flowUrl: string) =>
    Promise.delay(300).then(() => {
      console.log('Unpinning flow:', flowUrl);
      const pinnedFlows = JSON.parse(localStorage.getItem('pinnedFlows') || '[]');
      const updatedFlows = pinnedFlows.filter((url: string) => url !== flowUrl);
      localStorage.setItem('pinnedFlows', JSON.stringify(updatedFlows));
      console.log('Successfully unpinned flow:', flowUrl);
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

  // Get output for a specific flow using simple fetch
  getFlowOutput: async (flowId: string) => {
    const url = `${reg_url}/flow/${flowId}/stdout`;
    console.log('Fetching flow output:', url);

    try {
      const response = await fetch(url);
      return await response.text();
    } catch (error) {
      console.error('Error fetching flow output:', error);
      return 'Error: Failed to fetch output data';
    }
  },

  // Get steps for a specific flow using simple fetch
  getFlowSteps: async (flowId: string) => {
    const url = `${reg_url}/flow/${flowId}/event`;
    console.log('Fetching flow steps:', url);

    try {
      const response = await fetch(url);
      return await response.text();
    } catch (error) {
      console.error('Error fetching flow steps:', error);
      return 'Error: Failed to fetch steps data';
    }
  },

  // Get errors for a specific flow using stderr endpoint
  getFlowErrors: async (flowId: string) => {
    const url = `${reg_url}/flow/${flowId}/stderr`;
    console.log('Fetching flow errors:', url);

    try {
      const response = await fetch(url);
      return await response.text();
    } catch (error) {
      console.error('Error fetching flow errors:', error);
      return 'Error: Failed to fetch error data';
    }
  },

  getFlowDetails: async (flowId: string) => {
    const url = `${reg_url}/flow/${flowId}`;
    console.log('Fetching flow details:', url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch flow details for ID: ${flowId}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching flow details:', error);
      throw error;
    }
  },

  removeFlow: async (flowId: string) => {
    const url = `${reg_url}/flow/${flowId}/remove`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove flow');
      }
      // Just return success since there's no response body
      return { success: true };
    } catch (error) {
      console.error('Error removing flow:', error);
      throw error;
    }
  },
};