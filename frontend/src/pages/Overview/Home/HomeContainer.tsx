import React from 'react';
import HomePresentation from './HomePresentation';

const HomeContainer: React.FC = () => {
  // Example state or logic you'd normally fetch
  const userName = 'Andrei Budaes';
  const projectName = 'Test Project';

  return <HomePresentation userName={userName} projectName={projectName} />;
};

export default HomeContainer;
