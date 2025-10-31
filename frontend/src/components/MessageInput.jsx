import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { X, Image, Send } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessages } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return console.log("Can't send message");
    if (isSending) return; // ป้องกันการส่งซ้ำถ้ากำลังส่งอยู่

    try {
      setIsSending(true);
      await sendMessages({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // เพิ่ม delay 1 วินาทีหลังจากส่งข้อความ
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.log(`Failed to send message: ${err}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full p-4">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="size-20 rounded-lg border border-zinc-700 object-cover"
            />
            <button
              onClick={removeImage}
              className="bg-base-300 absolute -top-1.5 -right-1.5 flex size-5 cursor-pointer items-center justify-center rounded-full"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            className="input input-bordered input-sm sm:input-md w-full rounded-lg outline-none"
            palceholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`btn btn-circle hidden sm:flex ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        <button
          type="submit"
          className={`btn btn-circle ${isSending ? 'btn-disabled' : ''}`}
          disabled={(!text.trim() && !imagePreview) || isSending}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
