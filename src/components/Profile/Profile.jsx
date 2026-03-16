import { useEffect, useState } from "react";
import { fetchData } from "../../api/apiService";
import toast from "react-hot-toast";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetchData("/api/user/get-user-profile");
        if (response?.responseCode === 200) setProfile(response.data);
        else toast.error(response?.message || "Failed to load profile");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, []);

  const getInitials = (name) =>
    name
      ?.split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading) return <p className="pf-msg">Loading profile...</p>;
  if (!profile) return <p className="pf-msg">No profile data.</p>;

  return (
    <div className="pf-section">

      <div className="pf-card">
        {/* Avatar */}
        <div className="pf-avatar-wrap">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="pf-avatar-img"
            />
          ) : (
            <div className="pf-avatar-fallback">
              {getInitials(profile.name)}
            </div>
          )}
          {profile.provider === "google" && (
            <span className="pf-provider-badge" title="Signed in with Google">
              G
            </span>
          )}
        </div>

        {/* Name + email */}
        <div className="pf-identity">
          <h3 className="pf-name">{profile.name}</h3>
          <p className="pf-email">{profile.email}</p>
        </div>

        <div className="pf-divider" />

        {/* Details */}
        <div className="pf-details">
          <div className="pf-row">
            <span className="pf-key">Member since</span>
            <span className="pf-val">{formatDate(profile.createdAt)}</span>
          </div>
          <div className="pf-row">
            <span className="pf-key">Last updated</span>
            <span className="pf-val">{formatDate(profile.updatedAt)}</span>
          </div>
          <div className="pf-row">
            <span className="pf-key">Sign-in method</span>
            <span className="pf-val pf-provider">
              {profile.provider === "google" ? (
                <>
                  <span className="pf-google-dot" /> Google
                </>
              ) : (
                "Email & Password"
              )}
            </span>
          </div>
          <div className="pf-row">
            <span className="pf-key">Account status</span>
            <span
              className={`pf-badge ${profile.isActive ? "active" : "inactive"}`}
            >
              {profile.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
