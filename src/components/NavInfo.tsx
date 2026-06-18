import { LucideIcon } from 'lucide-react';

interface NavInfoProps {
  info: string;
  Icon: LucideIcon;
}
const NavInfo: React.FC<NavInfoProps> = ({ info, Icon }) => {
  return (
    <div className="flex justify-center items-center gap-2 lg:pr-1 xl:pr-5 ">
      <Icon className="size-4 text-secondary-yellow" />
      <p className="font-medium text-white text-xs">{info}</p>
    </div>
  );
};

export default NavInfo;
