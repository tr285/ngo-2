const PlaceholderPage = ({ title, description }) => (
  <div className="card">
    <h2 className="text-xl font-semibold">{title}</h2>
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

export default PlaceholderPage;
