import React from 'react';
import HomePresentation from './HomePresentation';

const HomeContainer: React.FC = () => {
  // Example state or logic you'd normally fetch
  const userName = 'Andrei Budaes';
  const workspaceName = localStorage.getItem('workspace_name') || 'default';

  return <HomePresentation userName={userName} workspaceName={workspaceName} />;
};

export default HomeContainer;
