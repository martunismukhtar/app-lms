import { useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveSessions } from "../../utils/permission";
import { UserContext } from "../../context/LayoutContext";
import useToast from "../../components/Toast/useToast";

export default function GoogleLoginButton({
  className
}) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_Id;
  const apiUrl = import.meta.env.VITE_API;
  const { setDisabledButton } = useContext(UserContext);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLoginSuccess = useCallback(
    (data) => {
      saveSessions({
        access: data.access,
        refresh: data.refresh,
        organization: data.organization,
        roles: data.roles,
        permissions: data.permissions,
        user: data.user,
      });

      navigate(data.organization ? "/dashboard" : "/organisasi");
    },
    [navigate]
  );

  const handleCredentialResponse = useCallback(
    async (response) => {
      try {
        setDisabledButton(true);
        const { credential: idToken } = response;

        const res = await fetch(`${apiUrl}auth/google/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: idToken }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Authentication failed");
        }

        handleLoginSuccess(data);
      } catch (error) {
        showToast(`Login failed: ${error.message || "Unknown error"}`, "error");
      } finally {
        setDisabledButton(false);
      }
    },
    [apiUrl, handleLoginSuccess, setDisabledButton, showToast]
  );

  useEffect(() => {
    // Initialize Google Auth
    if (window.google?.accounts?.id && clientId) {
      try {
        setDisabledButton(true);

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          ux_mode: "popup",
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-login-button"),
          { theme: "outline", size: "large" }
        );

        window.google.accounts.id.prompt();
      } catch (error) {
        console.error("Google Auth initialization error:", error);
        showToast("Failed to initialize Google Sign-In", "error");
      } finally {
        setDisabledButton(false);
      }
    }
  }, [clientId, handleCredentialResponse, setDisabledButton, showToast]);

  return (
    <>
      <div id="google-login-button" className={`${className}`}></div>
    </>
  );
}
