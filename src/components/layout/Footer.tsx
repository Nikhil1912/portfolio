import { SocialLinks } from './SocialLinks';

export function Footer(): React.ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-surface-container-low py-10 px-8">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-body-md font-heading font-semibold text-on-surface">
            Nikhil Mehra
          </span>
          <span className="text-label-sm text-on-surface-variant">
            &copy; {currentYear} All rights reserved.
          </span>
        </div>
        <SocialLinks />
      </div>
    </footer>
  );
}
