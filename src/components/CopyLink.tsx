type Props = { url: string };

/**
 * "Copy link" action. Rendered hidden and enabled by src/client/copy-link.ts,
 * so visitors without JavaScript never see a button that does nothing.
 */
export function CopyLink({ url }: Props) {
  return (
    <span className="copy-link">
      <button type="button" className="copy-link__button" data-copy-link={url} hidden>
        Copy link
      </button>
      <span className="visually-hidden" role="status" data-copy-status />
    </span>
  );
}
