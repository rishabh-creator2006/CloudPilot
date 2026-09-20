export type UserRole = 'ADMIN' | 'DEVELOPER' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
}

export interface DashboardSummary {
  health: {
    score: number;
    state: string;
    warningCount?: number;
    degradedCount: number;
  };

  resources: {
    total: number;
    running: number;
    warning?: number;
    critical?: number;
  };

  cost: {
    currency?: string;
    currencySymbol?: string;
    today?: number;
    month: number;
    budget: number;
    projected?: number;
    utilizationPercent: number;
  };

  traffic?: {
    current: number;
    changePercent: number;
  };

  latency: {
    p95: number;
  };

  cpu: {
    current: number;
  };

  recommendationsCount?: number;
  isSimulationSpikeActive: boolean;
}

export interface MetricDataPoint {
  timestamp: string;
  cpu: number;
  memory: number;
  latency: number;
  traffic: number;
  errorRate: number;
  instances: number;
}

export interface CloudResource {
  id: string;
  name: string;
  type: string;

  provider?: string;
  providerResourceId: string;
  service?: string;
  region?: string;

  capacity: number;
  minCapacity: number;
  maxCapacity: number;

  currentCpu: number;
  currentLatency: number;
  errorRate: number;

  monthlyCost: number;

  health: string;
  healthScore: number;
  healthReasons: string[];

  status?: string;
  currentTraffic?: number;
}

export interface Recommendation {
  id: string;
  type?: string;
  resourceId?: string;
  resource: string;

  currentCapacity: number;
  proposedCapacity: number;

  reasons: string[];

  cost: {
    currency?: string;
    currencySymbol: string;
    currentMonthly: number;
    proposedMonthly: number;
    difference: number;
  };

  checks?: {
    policy: boolean | string;
    budget: boolean | string;
    permission: boolean | string;
    safety: boolean | string;
  };

  requiresApproval?: boolean;
  status: string;
  createdAt?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  created_at?: string;

  user_name: string;
  action: string;

  resource_name?: string;

  old_state?: string;
  new_state?: string;

  result: string;
  details?: string;
}

export interface Budget {
  id: string;
  name?: string;

  current_spend: number;
  monthly_limit: number;
  warning_threshold: number;

  amount?: number;
  spent?: number;
  currency?: string;
  period?: string;
  status?: string;
}

export interface CloudAccount {
  id: string;
  name: string;
  provider: string;

  accountId?: string;
  account_id?: string;

  region?: string;
  status?: string;

  access_token?: string;
}

export interface Policy {
  id: string;
  name: string;

  description?: string;
  status?: string;
  enabled?: boolean;
  severity?: string;

  min_instances: number;
  max_instances: number;
  max_scale_delta: number;

  allowed_regions: string | string[];
  require_approval: boolean;
}
