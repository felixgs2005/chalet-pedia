import { useEffect, useState } from "react";
import ActionModal from "../ActionModal";
import DescriptionBlocksContent from "../DescriptionBlocksContent";
import { fetchUserProfile } from "../../services/userProfileFirestore";
import { formatDisplayValue } from "../../utils/formatDisplayValue";
import AdminListingGallery from "./AdminListingGallery";
import { collectionLabel, listingLabel } from "../../utils/adminListingLabels";
import { listingStatutLabel } from "../../utils/listingStatut";
import {
  getPlainListingDescription,
  getServiceDescriptionBlocks,
  hasBlockListingDescription,
} from "../../utils/serviceDescription";

function formatOwnerLabel(profile) {
  if (!profile) return null;
  const name = [profile.prenom, profile.nom].filter(Boolean).join(" ").trim();
  if (name) return name;
  if (profile.courriel) return profile.courriel;
  return null;
}

function DetailRow({ label, value, mono = false }) {
  const display = formatDisplayValue(value);
  if (!display) return null;
  return (
    <div className="admin-detail__row">
      <dt>{label}</dt>
      <dd className={mono ? "admin-detail__mono" : undefined}>{display}</dd>
    </div>
  );
}

function AdminDescriptionContent({ item }) {
  if (hasBlockListingDescription(item)) {
    const blocks = getServiceDescriptionBlocks(item);
    return (
      <DescriptionBlocksContent
        blocks={blocks}
        variant="admin"
        emptyFallback={<p className="admin-detail__description">—</p>}
      />
    );
  }

  const plain = getPlainListingDescription(item);
  return <p className="admin-detail__description">{formatDisplayValue(plain) || "—"}</p>;
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
    (item.prixParNuit != null && item.prixParNuit !== ""
      ? `${formatDisplayValue(item.prixParNuit)} $/nuit`
      : null) ||
    formatDisplayValue(item.prix) ||
    formatDisplayValue(item.tarification) ||
    "—";
  const isService = item._collection === "services";
  const isVente = item._collection === "ventes";
  const region =
    formatDisplayValue(item.region) ||
    formatDisplayValue(item.regionLabel) ||
    (isService ? formatDisplayValue(item.localisation) : "") ||
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
          <AdminListingGallery item={item} />

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
