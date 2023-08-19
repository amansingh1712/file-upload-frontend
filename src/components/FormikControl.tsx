import { FileUpload } from './FileUpload';

export const FormikControl = (props: any) => {
  const { control, ...rest } = props;
  switch (control) {
    case 'upload':
      return <FileUpload {...rest} />;
    default:
      return null;
  }
};
