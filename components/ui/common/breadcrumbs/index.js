import { Fragment } from 'react';
import { ActiveLink } from '@components/ui/common';

const BreadcrumbItem = ({ link, index }) => {
  return (
    <li
      className={`${
        index === 0 ? 'pr-4' : 'px-4'
      }  font-medium text-gray-500 hover:text-gray-900`}
    >
      <ActiveLink href={link.href} activeLinkClass='text-yellow-400'>
        <a>{link.label}</a>
      </ActiveLink>
    </li>
  );
};

export default function Breadcrumbs({ links, isAdmin }) {
  return (
    <nav aria-label='breadcrumb'>
      <ol className='flex leading-none text-indigo-600 divide-x divide-indigo-400'>
        {links.map((link, index) => (
          <Fragment key={link.href}>
            {!link.isVisible && <BreadcrumbItem link={link} index={index} />}
            {link.isVisible && isAdmin && (
              <BreadcrumbItem link={link} index={index} />
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
