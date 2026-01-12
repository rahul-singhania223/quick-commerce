"use client";

import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z, { success } from "zod";
import ImageUploader from "./image-uploader";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useStoreForm } from "@/zustand-store/storeForm.store";
import {
  createStoreFormSchema,
  StoreFormData,
  StoreFormStep,
} from "@/schema/store.schema";
import { useUser } from "@/zustand-store/user.store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { storeQuery } from "@/quries/store.query";
import { AxiosError } from "axios";
import { ErrorResponse, Store, SuccessResponse, Zone } from "@/types/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@radix-ui/react-select";
import LocationInput from "./location-input";
import { zoneQuery } from "@/quries/zone.query";
import { cn } from "@/lib/utils";

function Review() {
  const [submitting, setSubmitting] = useState(false);

  const { data, reset } = useStoreForm();

  const router = useRouter();

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await storeQuery.createStore(
        data as z.infer<typeof createStoreFormSchema>
      );
      const newStoreData = (res.data as SuccessResponse).data as Store;
      toast.success("Store created successfully!");
      reset();
      return router.push(`/store`);
    } catch (error) {
      const errorDetails = error as ErrorResponse;
      console.log(errorDetails);
      return toast.error(errorDetails.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl lg:font-semibold text-foreground">
          Review Details
        </h1>
        <p className="text-body/60 mt-1">
          Please verify all details carefully before submitting for verification
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-20">
        <div className="">
          <h2 className="text-xl font-semibold">Store Information</h2>

          <div className="mt-6 space-y-5 max-w-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Name:</span>
              <span className="text-body">{data.name || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Logo:</span>
              <Image
                className="w-20 h-20"
                src={data.logo || ""}
                width={400}
                height={400}
                alt="logo"
              />
            </div>
          </div>
        </div>

        <div className="">
          <h2 className="text-xl font-semibold">Owner Details</h2>

          <div className="mt-6 space-y-5 max-w-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Owner Name:</span>
              <span className="text-body">{data.owner_name || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Phone:</span>
              <span className="text-body">{data.phone || "-"}</span>
            </div>
          </div>
        </div>

        <div className="">
          <h2 className="text-xl font-semibold">Location Details</h2>

          <div className="mt-6 space-y-5 max-w-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Address:</span>
              <span className="text-body">{data.address || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Latitude:</span>
              <span className="text-body">{data.latitude || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Longitude:</span>
              <span className="text-body">{data.longitude || "-"}</span>
            </div>
          </div>
        </div>

        <div className="">
          <h2 className="text-xl font-semibold">Legal Details</h2>

          <div className="mt-6 space-y-5 max-w-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Adhaar:</span>
              <span className="text-body">{data.adhaar || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">PAN:</span>
              <span className="text-body">{data.pan || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">GST.:</span>
              <span className="text-body">{data.gst || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">FSSAI:</span>
              <span className="text-body">{data.fssai || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Store Front:</span>
              <Image
                className="w-20 h-20"
                src={data.front_photo || ""}
                width={400}
                height={400}
                alt="logo"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Store Inside:</span>
              <Image
                className="w-20 h-20"
                src={data.inside_photo || ""}
                width={400}
                height={400}
                alt="logo"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onSubmit}
          disabled={submitting}
          className="h-12 text-lg w-full max-w-xs mt-20 space-x-2!"
        >
          {submitting && <Loader2 className="animate-spin" />}
          Submit
        </Button>
      </div>
    </div>
  );
}

function Legal() {
  const { data, step, setField, nextStep, prevStep } = useStoreForm();

  const formSchema = z.object({
    gst: z
      .string()
      .length(15, "GST number must be 15 characters long!")
      .regex(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
        "Invalid GST number!"
      ),
    fssai: z
      .string()
      .regex(/^[0-9]{14}$/, "Invalid FSSAI number!")
      .optional(),
    adhaar: z
      .string()
      .min(12, "Adhaar number must be 12 characters long!")
      .regex(/^[2-9]{1}[0-9]{11}$/, {
        message: "Invalid Adhaar number!",
      }),
    pan: z
      .string()
      .length(10, "PAN number must be 10 characters long!")
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN number!"),
    inside_photo: z.url({ message: "Invalid photo URL!" }),
    front_photo: z.url({ message: "Invalid photo URL!" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gst: data.gst || "",
      fssai: data.fssai || undefined,
      adhaar: data.adhaar || "",
      pan: data.pan || "",
      inside_photo: data.inside_photo || "",
      front_photo: data.front_photo || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setField("gst", data.gst);
    setField("pan", data.pan);
    setField("adhaar", data.adhaar);
    setField("inside_photo", data.inside_photo);
    setField("fssai", data.fssai);
    setField("front_photo", data.front_photo);
    nextStep();
  };

  if (step !== "LEGAL") return null;

  return (
    <div className="w-full h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl lg:font-semibold text-foreground">
          Legal Details
        </h1>
        <p className="text-body/60 mt-1">For store verification.</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 flex-1 flex flex-col"
        >
          <div className="space-y-8 lg:grid lg:grid-cols-2">
            <FormField
              control={form.control}
              name="adhaar"
              render={({ field }) => (
                <div className="flex-1">
                  <FormLabel className="text-lg font-semibold mb-2">
                    Adhaar Number
                  </FormLabel>
                  <Input
                    placeholder="Eg. 1234 1234 1234"
                    className="h-13 text-base! focus:ring-primary/50! focus:ring-1! max-w-md"
                    {...field}
                  />
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="gst"
              render={({ field }) => (
                <div className="flex-1">
                  <FormLabel className="text-lg font-semibold mb-2">
                    GST.
                  </FormLabel>
                  <Input
                    placeholder="Eg. 12AA1234567C1ZP"
                    className="h-13 text-base! focus:ring-primary/50! focus:ring-1! max-w-md"
                    {...field}
                  />
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="pan"
              render={({ field }) => (
                <div className="flex-1">
                  <FormLabel className="text-lg font-semibold mb-2">
                    PAN Number
                  </FormLabel>
                  <Input
                    placeholder="Eg. AAAAA1234A"
                    className="h-13 text-base! focus:ring-primary/50! focus:ring-1! max-w-md"
                    {...field}
                  />
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="fssai"
              render={({ field }) => (
                <div className="flex-1">
                  <FormLabel className="text-lg font-semibold mb-2">
                    FSSAI {"(Optional)"}
                  </FormLabel>
                  <Input
                    placeholder="Eg. 21/001/00012345"
                    className="h-13 text-base! focus:ring-primary/50! focus:ring-1! max-w-md"
                    {...field}
                  />
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="front_photo"
              render={({ field }) => (
                <div className="flex-1">
                  <FormLabel className="text-lg font-semibold mb-2">
                    Store Front
                  </FormLabel>
                  <ImageUploader
                    value={field.value}
                    onFileChange={(val: string) => field.onChange(val)}
                  />
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="inside_photo"
              render={({ field }) => (
                <div className="flex-1">
                  <FormLabel className="text-lg font-semibold mb-2">
                    Store Inside
                  </FormLabel>
                  <ImageUploader
                    value={field.value}
                    onFileChange={(val: string) => field.onChange(val)}
                  />
                  <FormMessage />
                </div>
              )}
            />
          </div>
          <div className="flex items-center justify-center gap-4 mt-20">
            <Button
              onClick={() => prevStep()}
              type="button"
              variant={"secondary"}
              className="text-lg h-13 flex-1 max-w-sm"
            >
              <ChevronLeft className="size-6!" />
              Previous
            </Button>
            <Button type="submit" className="text-lg h-13 flex-1 max-w-sm">
              Review & Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function Location() {
  const { data, step, setField, nextStep, prevStep } = useStoreForm();
  const [address, setAddress] = useState(data.address || "");
  const [gettingZone, setGettingZone] = useState(false);
  const [selectedZone, setSelectedZone] = useState<any>(
    data.zone_id ? { success: true, zone: { id: data.zone_id } } : null
  );

  const formSchema = z.object({
    address: z.string().min(3, "Name must be at least 3 characters long!"),
    location: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
    zone_id: z.uuid({ message: "Invalid zone ID!" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: data.address || "",
      location: data
        ? { latitude: data.latitude || 0, longitude: data.longitude }
        : {
            latitude: 0,
            longitude: 0,
          },
      zone_id: data.zone_id || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setField("address", values.address);
    setField("zone_id", values.zone_id);
    setField("latitude", values.location.latitude);
    setField("longitude", values.location.longitude);
    nextStep();
  };

  const getZoneByPosition = async (pos: { lat: number; lng: number }) => {
    try {
      setGettingZone(true);
      console.log("find the zone");
      const res = await zoneQuery.getZoneByPosition(pos);
      setSelectedZone(res.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to get zone!");
    } finally {
      setGettingZone(false);
    }
  };

  useEffect(() => {
    if (!selectedZone) return;
    if (selectedZone && !selectedZone.success) return;

    form.setValue("zone_id", selectedZone.zone.id);
    console.log(selectedZone)
  }, [selectedZone]);

  if (step !== "LOCATION") return null;

  return (
    <div className="w-full h-full flex flex-col  min-h-screen">
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl lg:font-semibold text-foreground">
          Location Details
        </h1>
        <p className="text-body/60 mt-1">For navigation and pickup.</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 flex-1 flex flex-col "
        >
          <div className="space-y-8 lg:grid lg:grid-cols-2 flex-1">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <div className="flex-1">
                    <FormLabel className="text-lg font-semibold mb-1">
                      Address
                    </FormLabel>
                    <p className="text-muted-foreground text-xs my-1 mb-2">
                      Start typing to center the map on your store's location
                    </p>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={() => {
                        setAddress(field.value);
                        setSelectedZone(null);
                      }}
                      placeholder="village/market, city, state, pincode"
                      className="h-13 text-base! focus:ring-primary/50! focus:ring-1! max-w-md"
                      // {...field}
                    />
                    <FormMessage />
                  </div>
                )}
              />

              <div className="flex-1">
                {!selectedZone && address && (
                  <p className="text-primary">
                    Drag the marker on the map to you store location.
                  </p>
                )}

                {address && selectedZone && !selectedZone.success && (
                  <p className="text-red-500">
                    <AlertTriangle className="text-red-500" />
                    {"Currently we are not operating in this area!"}
                  </p>
                )}
                {address && selectedZone && selectedZone.success && (
                  <div className="text-green-500">
                    <p>
                      <CheckCircle2 className="text-green-500" />
                      {"We are operating in this area!"}
                    </p>
                    {/* <span className="">
                      Selected Zone: {selectedZone.zone.name}
                    </span> */}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 h-full flex flex-col ">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <div className="flex-1 flex flex-col">
                    <FormLabel className="text-lg font-semibold mb-2">
                      Location
                    </FormLabel>

                    <LocationInput
                      address={address}
                      selectedLocation={
                        data.latitude && data.longitude
                          ? {
                              lat: data.latitude as number,
                              lng: data.longitude as number,
                            }
                          : undefined
                      }
                      onPositionChange={(pos) => {
                        field.onChange({
                          latitude: pos.lat,
                          longitude: pos.lng,
                        });
                        getZoneByPosition(pos);
                      }}
                    />
                  </div>
                )}
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-10">
            <Button
              onClick={() => prevStep()}
              type="button"
              variant={"secondary"}
              className="text-lg h-13 flex-1 max-w-sm"
            >
              <ChevronLeft className="size-6!" />
              Previous
            </Button>
            <Button type="submit" className="text-lg h-13 flex-1 max-w-sm">
              Next
              <ChevronRight className="size-6!" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function Owner() {
  const { data, step, setField, nextStep, prevStep } = useStoreForm();
  const { user } = useUser();

  const formSchema = z.object({
    owner_name: z.string().min(3, "Name must be at least 3 characters long!"),
    phone: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      owner_name: data.owner_name || "",
      phone: data.phone || user?.phone || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setField("owner_name", data.owner_name);
    setField("phone", data.phone);
    console.log(data.phone);
    nextStep();
  };

  if (!user) return null;
  if (step !== "OWNER") return null;

  return (
    <div className="w-full h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl lg:font-semibold text-foreground">
          Owner Details
        </h1>
        <p className="text-body/60 mt-1">
          For future reference, please enter the owner&apos;s details.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 flex-1 flex flex-col"
        >
          <div className="space-y-8 lg:flex">
            <FormField
              control={form.control}
              name="owner_name"
              render={({ field }) => (
                <div className="flex-1">
                  <FormLabel className="text-lg font-semibold mb-2">
                    Owner Name
                  </FormLabel>
                  <Input
                    placeholder="Eg. Sharma Jee"
                    className="h-13 text-base! focus:ring-primary/50! focus:ring-1! max-w-md"
                    {...field}
                  />
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <div className="flex-1">
                  <FormLabel className="text-lg font-semibold mb-2">
                    Phone
                  </FormLabel>
                  <Input
                    disabled={true}
                    value={"9939878713"}
                    placeholder="Eg. 1234567890"
                    className="h-13 text-base! focus:ring-primary/50! focus:ring-1! max-w-md cursor-not-allowed!"
                    // {...field}
                  />
                  <FormMessage />
                </div>
              )}
            />
          </div>
          <div className="flex items-center justify-center gap-4 mt-20">
            <Button
              onClick={() => prevStep()}
              type="button"
              variant={"secondary"}
              className="text-lg h-13 flex-1 max-w-sm"
            >
              <ChevronLeft className="size-6!" />
              Previous
            </Button>
            <Button type="submit" className="text-lg h-13 flex-1 max-w-sm">
              Next
              <ChevronRight className="size-6!" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function Basic() {
  const { data, step, setField, nextStep, prevStep } = useStoreForm();

  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long!"),
    logo: z.url({ message: "Invalid logo URL!" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name || "",
      logo: data.logo || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setField("name", data.name);
    setField("logo", data.logo);
    nextStep();
  };

  if (step !== "BASIC") return null;

  return (
    <div className="w-full h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl lg:font-semibold text-foreground">
          Store Information
        </h1>
        <p className="text-body/60 mt-1">
          This information will be visible to your customers.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 flex-1 flex flex-col"
        >
          <div className="space-y-8 lg:flex">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <div className="flex-1">
                  <FormLabel className="text-lg font-semibold mb-2">
                    Store Name
                  </FormLabel>
                  <Input
                    placeholder="Eg. Sharma kirana dukaan"
                    className="h-13 text-base! focus:ring-primary/50! focus:ring-1! max-w-md"
                    {...field}
                  />
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <div className="flex-1">
                  <FormLabel className="text-lg font-semibold mb-2">
                    Store Logo
                  </FormLabel>
                  <ImageUploader
                    value={field.value}
                    onFileChange={(val: string) => field.onChange(val)}
                  />
                  <FormMessage />
                </div>
              )}
            />
          </div>
          <div className="flex items-center justify-center gap-4 mt-20">
            <Button
              disabled={step === "BASIC"}
              onClick={() => prevStep()}
              type="button"
              variant={"secondary"}
              className="text-lg h-13 flex-1 max-w-sm"
            >
              <ChevronLeft className="size-6!" />
              Previous
            </Button>
            <Button type="submit" className="text-lg h-13 flex-1 max-w-sm">
              Next
              <ChevronRight className="size-6!" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default function CreateStoreForm() {
  const { step, data } = useStoreForm();

  return (
    <div className="min-h-full! w-full flex-1 bg-white shadow rounded-lg p-6">
      {step === "BASIC" && <Basic />}
      {step === "OWNER" && <Owner />}
      {step === "LOCATION" && <Location />}
      {step === "LEGAL" && <Legal />}
      {step === "REVIEW" && <Review />}
    </div>
  );
}
