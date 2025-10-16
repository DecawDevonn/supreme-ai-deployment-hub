import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GitBranch, Activity, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  fetchInfraTracking, 
  getStatusColor, 
  formatTimestamp,
  type InfraTrackingData 
} from '@/services/infraTracking';
import { useDeployment } from '@/contexts/deployment';

const InfrastructureTracking: React.FC = () => {
  const [trackingData, setTrackingData] = useState<InfraTrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const { addLog } = useDeployment();

  useEffect(() => {
    const loadTrackingData = async () => {
      setLoading(true);
      const data = await fetchInfraTracking();
      if (data) {
        setTrackingData(data);
        addLog('Infrastructure tracking data loaded', 'success');
      } else {
        addLog('Failed to load infrastructure tracking data', 'error');
      }
      setLoading(false);
    };

    loadTrackingData();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadTrackingData, 30000);
    return () => clearInterval(interval);
  }, [addLog]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Infrastructure Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading tracking data...</div>
        </CardContent>
      </Card>
    );
  }

  if (!trackingData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Infrastructure Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p className="text-sm">Infrastructure tracking data not available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Infrastructure Tracking
        </CardTitle>
        <CardDescription className="flex items-center text-xs">
          <Clock className="h-3 w-3 mr-1" />
          Last updated: {formatTimestamp(trackingData.infra_tracking.last_update)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pipelines Section */}
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Pipeline Status
          </h4>
          <div className="space-y-2">
            {Object.entries(trackingData.infra_tracking.pipelines).map(([key, pipeline]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg border ${getStatusColor(pipeline.status)}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <div className="font-medium text-sm capitalize">
                      {key.replace(/_/g, ' ')}
                    </div>
                    <div className="text-xs mt-1 opacity-80">{pipeline.note}</div>
                  </div>
                  <Badge variant="outline" className="ml-2 capitalize">
                    {pipeline.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs opacity-70">
                  <span className="flex items-center">
                    <GitBranch className="h-3 w-3 mr-1" />
                    {pipeline.branch}
                  </span>
                  <span>by {pipeline.last_modified_by}</span>
                  {pipeline.trigger && (
                    <span className="italic">Trigger: {pipeline.trigger}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Branches Section */}
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <GitBranch className="h-4 w-4 mr-2" />
            Branch Status
          </h4>
          <div className="space-y-2">
            {Object.entries(trackingData.branches).map(([branch, info]) => (
              <motion.div
                key={branch}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg border ${getStatusColor(info.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{branch}</div>
                    <div className="text-xs mt-1 opacity-80">{info.notes}</div>
                  </div>
                  <Badge variant="outline" className="ml-2 capitalize">
                    {info.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfrastructureTracking;
