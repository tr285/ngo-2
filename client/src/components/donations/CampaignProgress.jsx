import { formatCurrency } from '../../utils/formatters';

const CampaignProgress = ({ campaigns }) => {
  if (!campaigns.length) {
    return (
      <div className="card">
        <h3 className="font-semibold">Campaign Progress</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          No active campaigns to display.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="font-semibold">Campaign Progress</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Fundraising progress across active campaigns
        </p>
      </div>
      <ul className="space-y-5">
        {campaigns.map((campaign) => (
          <li key={campaign._id}>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{campaign.title}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {campaign.progressPercent}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className="h-full rounded-full bg-primary-600 transition-all"
                style={{ width: `${campaign.progressPercent}%` }}
              />
            </div>
            <div className="mt-1.5 flex flex-wrap justify-between gap-1 text-xs text-gray-500 dark:text-gray-400">
              <span>
                {formatCurrency(campaign.raisedAmount, campaign.currency)} raised
              </span>
              <span>
                Goal: {formatCurrency(campaign.goalAmount, campaign.currency)}
              </span>
              <span>{campaign.donorCount || 0} donors</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampaignProgress;
