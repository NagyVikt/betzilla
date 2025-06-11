import * as runtime from 'react/jsx-runtime'
import Image from 'next/image'

const sharedComponents = {
  Image,
};

type MDXContentProps = {
  code: string;
  components?: Record<string, React.ElementType>;
  [key: string]: any;
};

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

const MDXContent: React.FC<MDXContentProps> = ({ code, components = {}, ...props }) => {
  const Component = useMDXComponent(code);
  return <Component components={{ ...sharedComponents, ...components }} {...props} />;
};

export default MDXContent;
