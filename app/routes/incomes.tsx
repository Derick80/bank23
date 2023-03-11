import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node'

export async function loader({ request }: LoaderArgs) {
  return json()
}
