import { useEffect, useState } from "react";
import ActionModal from "../ActionModal";
import { fetchUserProfile } from "../../services/userProfileFirestore";
import { resolveListingImages } from "../../utils/serviceImages";
import { listingStatutLabel } from "../../utils/listingStatut";
import {
  getServiceDescriptionBlocks,
  normalizeDescriptionArray,
} from "../../utils/serviceDescription";

function collectionLabel(collection) {
  if (collection === "ventes") return "À vendre";
  if (collection === "services") return "Service";
  return "À louer";
}

function listingLabel(item) {
  return item.nom || item.titre || item.slug || item.id;
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasBlockDescription(item) {
  return normalizeDescriptionArray(item.description).some(
    (block) => block?.type || block?.contenu != null || block?.content != null || block?.p || block?.h || block?.ul
  );
}

function getPlainDescription(item) {
  if (typeof item.description === "string" && item.description.trim()) {
    return stripHtml(item.description);
  }
  if (item.descriptionHtml) return stripHtml(item.descriptionHtml);
  if (item.descriptionTitre) return stripHtml(item.descriptionTitre);
  return null;
}

function formatOwnerLabel(profile) {
  if (!profile) return null;
  const name = [profile.prenom, profile.nom].filter(Boolean).join(" ").trim();
  if (name) return name;
  if (profile.courriel) return profile.courriel;
  return null;
}

function DetailRow({ label, value, mono = false }) {
  if (value == null || value === "") return null;
  return (
    <div className="admin-detail__row">
      <dt>{label}</dt>
      <dd className={mono ? "admin-detail__mono" : undefined}>{value}</dd>
    </div>
  );
}

function AdminDescriptionContent({ item }) {
  if (hasBlockDescription(item)) {
    const blocks = getServiceDescriptionBlocks(item);
    if (blocks.length === 0) {
      return <p className="admin-detail__description">—</p>;
    }
    return (
      <div className="admin-detail__blocks">
        {blocks.map((block, i) => {
          if (block.h) {
            return (
              <h4 className="admin-detail__desc-heading" key={i}>
                {block.h}
              </h4>
            );
          }
          if (block.ul?.length > 0) {
            return (
              <ul className="admin-detail__desc-list" key={i}>
                {block.ul.map((entry, j) => (
                  <li key={j}>{entry}</li>
                ))}
              </ul>
            );
          }
          if (block.p) {
            return (
              <p
                className={`admin-detail__description${block.bold ? " admin-detail__description--bold" : ""}`}
                key={i}
              >
                {block.p}
              </p>
            );
          }
          return null;
        })}
      </div>
    );
  }

  const plain = getPlainDescription(item);
  return <p className="admin-detail__description">{plain || "—"}</p>;
}

export default function AdminListingDetailModal({ item, open, onClose }) {
  const [ownerProfile, setOwnerProfile] = useState(null);

  useEffect(() => {
    if (!open || !item?.proprietaireId) {
      setOwnerProfile(null);
      return undefined;
    }

    let cancelled = false;
    fetchUserProfile(item.proprietaireId)
      .then((profile) => {
        if (!cancelled) setOwnerProfile(profile);
      })
      .catch(() => {
        if (!cancelled) setOwnerProfile(null);
      });

    return () => {
      cancelled = true;
    };
  }, [open, item?.proprietaireId]);

  if (!item) return null;

  const title = listingLabel(item);
  const prix =
    item.prix ||
    (item.prixParNuit != null ? `${item.prixParNuit} $/nuit` : null) ||
    item.tarification ||
    "—";
  const images = resolveListingImages(item);
  const isService = item._collection === "services";
  const isVente = item._collection === "ventes";
  const region =
    item.region ||
    item.regionLabel ||
    (isService ? item.localisation : null) ||
    "—";

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      title={title}
      titleId="admin-listing-detail-title"
      className="admin-detail-modal"
      renderBody={() => (
        <div className="admin-detail">
          {images.length > 0 ? (
            <div className="admin-detail__gallery">
              {images.slice(0, 4).map((src, index) => (
                <img key={`${src}-${index}`} src={src} alt="" className="admin-detail__thumb" />
              ))}
            </div>
          ) : null}

          <dl className="admin-detail__grid">
            <DetailRow label="Type" value={collectionLabel(item._collection)} />
            <DetailRow label="Statut" value={listingStatutLabel(item.statut)} />
            <DetailRow label="Région" value={region} />
            <DetailRow label="Localisation" value={item.localisation || item.adresse || item.carte} />
            {!isService ? <DetailRow label="Prix / tarif" value={prix} /> : null}

            {isService ? (
              <>
                <DetailRow label="Catégorie" value={item.categorySlug} />
                <DetailRow label="Entreprise" value={item.nomEntreprise} />
                <DetailRow label="Numéro" value={item.numero} />
                <DetailRow label="Courriel" value={item.courrielContact} />
                <DetailRow label="Téléphone" value={item.telephoneContact} />
                <DetailRow label="Adresse" value={item.adresseContact} />
              </>
            ) : null}

            {!isService && item.citq ? <DetailRow label="CITQ" value={item.citq} /> : null}
            {!isService && (item.nombreChambres != null || item.chambres != null) ? (
              <DetailRow label="Chambres" value={item.nombreChambres ?? item.chambres} />
            ) : null}
            {!isService && (item.nombrePersonnes != null || item.invites != null) ? (
              <DetailRow label="Invités" value={item.nombrePersonnes ?? item.invites} />
            ) : null}
            {isVente && item.nombreSallesBain != null ? (
              <DetailRow label="Salles de bain" value={item.nombreSallesBain ?? item.sdb} />
            ) : null}

            <DetailRow label="Slug" value={item.slug || item.id} mono />
            {item.proprietaireId ? (
              <DetailRow label="Propriétaire" value={formatOwnerLabel(ownerProfile)} />
            ) : null}
            {!isService && item.courrielContact ? (
              <DetailRow label="Courriel contact" value={item.courrielContact} />
            ) : null}
            {!isService && item.telephoneContact ? (
              <DetailRow label="Téléphone contact" value={item.telephoneContact} />
            ) : null}
          </dl>

          <div className="admin-detail__section">
            <h3 className="admin-detail__section-title">Description</h3>
            <AdminDescriptionContent item={item} />
          </div>

          {item.tags?.length ? (
            <div className="admin-detail__section">
              <h3 className="admin-detail__section-title">Tags</h3>
              <div className="admin-detail__tags">
                {item.tags.map((tag) => (
                  <span key={String(tag)} className="admin-badge admin-badge--type">
                    {typeof tag === "string" ? tag : String(tag)}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {!isService && item.equipements?.length ? (
            <div className="admin-detail__section">
              <h3 className="admin-detail__section-title">Équipements</h3>
              <div className="admin-detail__tags">
                {item.equipements.map((eq) => (
                  <span key={String(eq)} className="admin-badge admin-badge--type">
                    {typeof eq === "string" ? eq : String(eq)}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    />
  );
}
