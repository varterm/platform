import ExtensionProductPage from '../ExtensionProductPage';
import { EXTENSION_PRODUCTS } from '../product-content';

const product = EXTENSION_PRODUCTS.vscode;

export const metadata = {
  title: product.title,
  description: product.description,
  alternates: { canonical: product.path },
  openGraph: {
    title: product.title,
    description: product.description,
    url: product.path,
  },
};

export default function VsCodeExtensionPage() {
  return <ExtensionProductPage productKey="vscode" />;
}
