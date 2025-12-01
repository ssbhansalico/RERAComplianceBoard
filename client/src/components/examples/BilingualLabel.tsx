import BilingualLabel from "../BilingualLabel";

export default function BilingualLabelExample() {
  return (
    <div className="p-4 space-y-4 bg-background">
      <BilingualLabel
        english="Project Name"
        gujarati="પ્રોજેક્ટનું નામ"
        htmlFor="demo"
        required
      />
      <BilingualLabel
        english="Authorized Person Name"
        gujarati="અધિકૃત વ્યક્તિનું નામ"
        htmlFor="demo2"
      />
    </div>
  );
}
