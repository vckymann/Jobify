import { jobSearchSchema } from "@/schemas/jobSearchSchema";
import { RootState } from "@/store/store";
import { Pagination, PaginationItem } from "@mui/material";
import { Stack } from "@mui/material";
import { UseFormSetValue } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

function PaginationComponent({
  pageNumber,
  setPageNumber,
}: {
  pageNumber: string;
  setPageNumber: UseFormSetValue<z.infer<typeof jobSearchSchema>>;
}) {
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPageNumber("page", String(newPage));
  };

  const isDarkMode = useSelector((state: RootState) => state.jobs.isDarkMode);

  return (
    <>
      <div className="mt-6 flex justify-center">
        <Stack spacing={2} sx={{ color: "red" }}>
          <Pagination
            sx={{
              color: "red",
            }}
            color="primary"
            onChange={handlePageChange}
            shape="rounded"
            page={Number(pageNumber) || 1}
            count={10}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  color: `${ isDarkMode ? "white" : "black"}`,                  
                }}
              />
            )}
          />
        </Stack>
      </div>
    </>
  );
}

export default PaginationComponent;
