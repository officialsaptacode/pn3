// import { FormCard } from "@/components/form-card";
// import Loader from "@/components/loader";
// import { MediaForm } from "../components/MediaForm";
// import useGetMedia from "../query/useGetMedia";

// export const EditMedia = ({ id }: { id: string }) => {
//   const { data, isLoading } = useGetMedia(id);
//   if (isLoading) {
//     return <Loader />;
//   }
//   return (
//     <FormCard title={`Edit Media: "${data?.name || ""}"`}>
//       <MediaForm defaultValues={data} />
//     </FormCard>
//   );
// };
