import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ActiveLink = ({ children, activeLinkClass, ...props }) => {
  const router = useRouter();
  const isActive = router.pathname === props.href;

  let className = children.props.className || '';

  if (isActive) {
    className = `${className} ${
      activeLinkClass ? activeLinkClass : 'text-indigo-600'
    }`;
  }

  return (
    <Link {...props} legacyBehavior>
      {React.cloneElement(children, { className })}
    </Link>
  );
};

export default ActiveLink;
