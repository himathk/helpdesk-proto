import * as Icons from 'lucide-react';

const DynamicIcon = ({ name, className, ...props }) => {
  const IconComponent = (name && Icons[name]) || Icons.Box;
  
  // If name is actually a component (legacy/fallback), render it
  if (typeof name === 'function' || typeof name === 'object') {
     const Component = name;
     return <Component className={className} {...props} />;
  }

  return <IconComponent className={className} {...props} />;
};

export default DynamicIcon;
