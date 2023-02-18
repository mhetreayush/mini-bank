import { Skeleton } from "@mui/material";
const Loader = ({ userButton }) => {
  return (
    <div className="min-h-[60px]">
      {userButton && <Skeleton variant="rounded" height={60} />}
    </div>
  );
};

export default Loader;
