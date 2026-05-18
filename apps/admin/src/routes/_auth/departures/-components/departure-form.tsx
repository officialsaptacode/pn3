import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { departureService, tripService } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useFormToast } from "@/hooks/use-form-toast";

const departureSchema = z.object({
  tripId: z.coerce.number().min(1, "Trip is required"),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  totalSeats: z.coerce.number().optional().nullable(),
  availableSeats: z.coerce.number().min(0).optional(),
  status: z.enum(["OPEN", "CANCELLED", "COMPLETED"]).optional(),
});

type DepartureFormValues = z.infer<typeof departureSchema>;

interface DepartureFormProps {
  initialData?: any;
}

export function DepartureForm({ initialData }: DepartureFormProps) {
  const navigate = useNavigate();

  const { data: trips } = useQuery({
    queryKey: ["trips"],
    queryFn: () => tripService.findAll({}),
  });

  const form = useForm<DepartureFormValues>({
    resolver: zodResolver(departureSchema as any),
    defaultValues: initialData
      ? {
          tripId: initialData.tripId,
          startDate: initialData.startDate
            ? new Date(initialData.startDate).toISOString().split("T")[0]
            : "",
          endDate: initialData.endDate
            ? new Date(initialData.endDate).toISOString().split("T")[0]
            : "",
          totalSeats: initialData.totalSeats,
          availableSeats: initialData.availableSeats,
          status: initialData.status || "OPEN",
        }
      : {
          tripId: 0,
          startDate: "",
          endDate: "",
          totalSeats: 10,
          availableSeats: undefined,
          status: "OPEN",
        },
  });

  const onSubmit = async (data: DepartureFormValues) => {
    try {
      const payload = {
        ...data,
        endDate: data.endDate || undefined,
        availableSeats: data.availableSeats || data.totalSeats,
      };

      if (initialData) {
        await departureService.update(initialData.id, payload);
        toast.success("Departure updated successfully");
      } else {
        await departureService.create(payload);
        toast.success("Departure created successfully");
      }
      navigate({ to: "/departures" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const { onError } = useFormToast<DepartureFormValues>(form.setFocus, {
    fieldLabels: {
      tripId: "Trip",
      startDate: "Start Date",
      endDate: "End Date",
      totalSeats: "Total Seats",
      availableSeats: "Available Seats",
      status: "Status",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="tripId"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Trip</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(Number(val))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trip" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {trips?.data?.map((trip: any) => (
                      <SelectItem key={trip.id} value={trip.id.toString()}>
                        {trip.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date (Optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalSeats"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Total Seats</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availableSeats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Seats (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Defaults to total seats"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Save Departure</Button>
      </form>
    </Form>
  );
}
