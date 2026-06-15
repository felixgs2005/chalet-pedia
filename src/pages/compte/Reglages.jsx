import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import {
  fetchUserProfile,
  saveUserProfile,
  uploadUserProfilePhoto,
} from "../../services/userProfileFirestore";

function splitDisplayName(displayName) {
  const parts = String(displayName || "")
    .trim()
    .split(/\s+/);
  return {
    prenom: parts[0] || "",
    nom: parts.slice(1).join(" "),
  };
}

export default function Reglages() {
  const { currentUser } = useAuth();
  const fileRef = useRef(null);

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [infosProfil, setInfosProfil] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!currentUser?.uid) return;
      setLoading(true);
      setError("");

      try {
        const profile = await fetchUserProfile(currentUser.uid);
        const fromAuth = splitDisplayName(currentUser.displayName);

        if (!cancelled) {
          setPrenom(profile?.prenom ?? fromAuth.prenom);
          setNom(profile?.nom ?? fromAuth.nom);
          setInfosProfil(profile?.infosProfil ?? profile?.bio ?? "");
          setPhotoPreview(profile?.photoProfil || currentUser.photoURL || "");
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Impossible de charger votre profil.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const onPhotoChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Veuillez choisir une image (JPG, PNG, WebP ou GIF).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image doit faire 5 Mo ou moins.");
      return;
    }
    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentUser) return;

    const wantsPasswordChange = newPassword.trim().length > 0;
    if (wantsPasswordChange && !currentPassword.trim()) {
      setError("Entrez votre mot de passe actuel pour en définir un nouveau.");
      return;
    }
    if (wantsPasswordChange && newPassword.length < 6) {
      setError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setSaving(true);

    try {
      let photoURL = photoPreview && !photoPreview.startsWith("blob:") ? photoPreview : "";

      if (photoFile) {
        photoURL = await uploadUserProfilePhoto(currentUser.uid, photoFile);
      }

      const displayName = [prenom.trim(), nom.trim()].filter(Boolean).join(" ");

      await updateProfile(auth.currentUser, {
        displayName: displayName || undefined,
        photoURL: photoURL || undefined,
      });

      await saveUserProfile(currentUser.uid, {
        prenom: prenom.trim(),
        nom: nom.trim(),
        infosProfil: infosProfil.trim(),
        photoProfil: photoURL,
        courriel: currentUser.email || "",
      });

      if (wantsPasswordChange) {
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          currentPassword
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
        setNewPassword("");
        setCurrentPassword("");
      }

      if (photoFile && photoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
      setPhotoFile(null);
      if (photoURL) setPhotoPreview(photoURL);

      setSuccess(
        wantsPasswordChange
          ? "Profil et mot de passe mis à jour."
          : "Profil enregistré."
      );
    } catch (err) {
      console.error(err);
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Mot de passe actuel incorrect.");
      } else if (err.code === "auth/weak-password") {
        setError("Le nouveau mot de passe est trop faible.");
      } else {
        setError(err.message || "Erreur lors de l'enregistrement.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="compte-reglages">
        <p className="compte-reglages__loading">Chargement du profil…</p>
      </div>
    );
  }

  return (
    <div className="compte-reglages">
      <div className="compte-reglages__inner">
        <h1 className="compte-reglages__title">Réglages</h1>

        {error ? (
          <div className="compte-reglages__alert compte-reglages__alert--error" role="alert">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="compte-reglages__alert compte-reglages__alert--success" role="status">
            {success}
          </div>
        ) : null}

        <form className="compte-reglages__form" onSubmit={handleSubmit}>
          <div className="compte-reglages__field">
            <span className="compte-reglages__label">Image du profil (facultatif)</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="compte-reglages__file-input"
              onChange={onPhotoChange}
              disabled={saving}
            />
            {photoPreview ? (
              <div className="compte-reglages__photo-preview">
                <img src={photoPreview} alt="Aperçu du profil" />
              </div>
            ) : null}
            <button
              type="button"
              className="compte-reglages__file-btn"
              onClick={() => fileRef.current?.click()}
              disabled={saving}
            >
              Sélectionner une image
            </button>
          </div>

          <div className="compte-reglages__field">
            <label className="compte-reglages__label" htmlFor="reglages-prenom">
              Prénom (facultatif)
            </label>
            <input
              id="reglages-prenom"
              type="text"
              className="compte-reglages__input"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="compte-reglages__field">
            <label className="compte-reglages__label" htmlFor="reglages-nom">
              Nom de famille (facultatif)
            </label>
            <input
              id="reglages-nom"
              type="text"
              className="compte-reglages__input"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="compte-reglages__field">
            <label className="compte-reglages__label" htmlFor="reglages-infos">
              Infos profil (facultatif)
            </label>
            <textarea
              id="reglages-infos"
              className="compte-reglages__textarea"
              value={infosProfil}
              onChange={(e) => setInfosProfil(e.target.value)}
              rows={6}
              disabled={saving}
            />
          </div>

          <div className="compte-reglages__field">
            <span className="compte-reglages__label">E-mail</span>
            <div className="compte-reglages__email">{currentUser?.email}</div>
          </div>

          <div className="compte-reglages__field">
            <label className="compte-reglages__label" htmlFor="reglages-new-password">
              Nouveau mot de passe (facultatif)
            </label>
            <input
              id="reglages-new-password"
              type="password"
              className="compte-reglages__input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              disabled={saving}
            />
          </div>

          <div className="compte-reglages__field">
            <label className="compte-reglages__label" htmlFor="reglages-current-password">
              Mot de passe actuel (facultatif)
            </label>
            <input
              id="reglages-current-password"
              type="password"
              className="compte-reglages__input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              disabled={saving}
            />
            <p className="compte-reglages__hint">
              Requis uniquement si vous modifiez le mot de passe.
            </p>
          </div>

          <button type="submit" className="compte-reglages__submit" disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer les modifications"}
          </button>
        </form>

        <Link to="/" className="compte-reglages__back">
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
