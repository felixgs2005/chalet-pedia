import ActionModal from "../ActionModal";
import { listingStatutLabel } from "../../utils/listingStatut";

function collectionLabel(collection) {
  return collection === "ventes" ? "À vendre" : "À louer";
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

export default function AdminListingDetailModal({ item, open, onClose }) {
  if (!item) return null;

  const title = listingLabel(item);
  const description =
    stripHtml(item.descriptionHtml) ||
    item.description ||
    stripHtml(item.descriptionTitre) ||
    "—";
  const prix = item.prix || item.prixParNuit || item.tarification || "—";
  const images = item.images?.length ? item.images : item.cardImage ? [item.cardImage] : [];

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
            <div className="admin-detail__row">
              <dt>Type</dt>
              <dd>{collectionLabel(item._collection)}</dd>
            </div>
            <div className="admin-detail__row">
              <dt>Statut</dt>
              <dd>{listingStatutLabel(item.statut)}</dd>
            </div>
            <div className="admin-detail__row">
              <dt>Région</dt>
              <dd>{item.region || item.regionLabel || "—"}</dd>
            </div>
            <div className="admin-detail__row">
              <dt>Localisation</dt>
              <dd>{item.localisation || item.adresse || "—"}</dd>
            </div>
            <div className="admin-detail__row">
              <dt>Prix / tarif</dt>
              <dd>{prix}</dd>
            </div>
            {item.citq ? (
              <div className="admin-detail__row">
                <dt>CITQ</dt>
                <dd>{item.citq}</dd>
              </div>
            ) : null}
            {item.nombreChambres != null || item.chambres != null ? (
              <div className="admin-detail__row">
                <dt>Chambres</dt>
                <dd>{item.nombreChambres ?? item.chambres}</dd>
              </div>
            ) : null}
            {item.nombrePersonnes != null || item.invites != null ? (
              <div className="admin-detail__row">
                <dt>Invités</dt>
                <dd>{item.nombrePersonnes ?? item.invites}</dd>
              </div>
            ) : null}
            <div className="admin-detail__row">
              <dt>Slug</dt>
              <dd className="admin-detail__mono">{item.slug || item.id}</dd>
            </div>
            {item.proprietaireId ? (
              <div className="admin-detail__row">
                <dt>Propriétaire</dt>
                <dd className="admin-detail__mono">{item.proprietaireId}</dd>
              </div>
            ) : null}
          </dl>

          <div className="admin-detail__section">
            <h3 className="admin-detail__section-title">Description</h3>
            <p className="admin-detail__description">{description}</p>
          </div>

          {item.tags?.length ? (
            <div className="admin-detail__section">
              <h3 className="admin-detail__section-title">Tags</h3>
              <div className="admin-detail__tags">
                {item.tags.map((tag) => (
                  <span key={tag} className="admin-badge admin-badge--type">
                    {tag}
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
