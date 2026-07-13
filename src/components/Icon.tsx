import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
  className?: string;
};

const Icon = React.forwardRef<SVGSVGElement, IconProps>(({ title, children, className, ...props }, ref) => {
  const titleId = title ? `${title.replace(/\s+/g, '-').toLowerCase()}-title` : undefined;
  return (
    <svg
      ref={ref}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : 'true'}
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      {children}
    </svg>
  );
});

Icon.displayName = 'Icon';

export default Icon;
