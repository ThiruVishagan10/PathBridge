import { getCurrentUser } from "@/lib/auth";
import DesktopNavbar from "./DesktopNavbar";

async function DesktopNavbarWrapper() {
  const user = await getCurrentUser();
  
  const serializedUser = user ? {
    id: user.id,
    username: user.username,
    emailAddress: user.email,
    role: user.role,
  } : null;

  return <DesktopNavbar user={serializedUser} />;
}

export default DesktopNavbarWrapper;