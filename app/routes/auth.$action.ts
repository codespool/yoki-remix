import { v4 as uuidv4 } from 'uuid';
import { json, LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async ({params}) => {

  switch (params.action) {
    case 'getNonce':
      return nonce();
    default:
      return json({ error: 'Invalid action' }, { status: 400 });
  }
};

function nonce() {
  const nonce = uuidv4();
  const data = { nonce: nonce };
  return json(data);
}
