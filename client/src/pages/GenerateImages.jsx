import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const imageStyles = [ "Realistic", "Ghibli style", "Pixel art", "Isometric", "Line art", "Low poly", "Origami", "Paper cut", "Silhouette", "Stencil", "Woodcut",];

const GenerateImages = () => {
  const [selectedStyle, setSelectedStyle] = useState(imageStyles[0]);
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;
      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        { headers: { Authorization: `Bearer ${await getToken()}` } },
      );
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="h-full overflow-y-auto p-6 sm:p-8 text-zinc-100">
      <h1 className="text-2xl font-semibold tracking-tight">Generate Images</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Create an image from a description and a style.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[26rem_minmax(0,1fr)] items-start">
        {/* Input */}
        <form
          onSubmit={onSubmitHandler}
          className="border border-zinc-800 rounded-md bg-zinc-900/40 p-5"
        >
          <label htmlFor="description" className="block text-sm text-zinc-300">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="A lighthouse on a cliff at dusk"
            required
            className="mt-2 w-full resize-none rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-cyan-400"
          />

          <p className="mt-5 text-sm text-zinc-300">Style</p>
          <div
            className="mt-2 flex flex-wrap gap-2"
            role="group"
            aria-label="Image style"
          >
            {imageStyles.map((item) => {
              const active = selectedStyle === item;
              return (
                <button
                  type="button"
                  key={item}
                  aria-pressed={active}
                  onClick={() => setSelectedStyle(item)}
                  className={`rounded-md border px-3 py-1.5 text-sm ${
                    active
                      ? "border-cyan-400 bg-zinc-900 text-zinc-100"
                      : "border-zinc-800 text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <label className="mt-5 flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
              className="h-4 w-4 accent-cyan-400"
            />
            Publish to Community
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-md bg-cyan-400 px-4 py-2.5 text-sm font-medium text-zinc-950 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && (
              <span className="h-4 w-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
            )}
            {loading ? "Generating…" : "Generate image"}
          </button>
        </form>

        {/* Output */}
        <section className="flex flex-col h-[600px] overflow-hidden border border-zinc-800 rounded-md bg-zinc-900/40">
          <header className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
            <h2 className="text-sm font-medium">Output</h2>
            {content && (
              <a
                href={content}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-zinc-400 hover:text-zinc-100"
              >
                Open in new tab
              </a>
            )}
          </header>

          {!content ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <p className="text-sm text-zinc-500 text-center">
                Describe an image and generate to see it here.
              </p>
            </div>
          ) : (
            <div className="flex-1 min-h-0 p-5 flex items-center justify-center">
              <img
                src={content} alt={input}
                className="max-h-full max-w-full object-contain rounded-md border border-zinc-800"
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default GenerateImages;



//checked={publish}-this makes it a controlled checkbox ie if publish is true then checked otherwise unchecked
//when user clicks on checkbox it triggers onChange event which updates the publish state to either true or false based on whether the checkbox is checked or not. This way the checkbox state is always in sync with the publish state.
//sr-only means screen reader only, it hides the checkbox visually but keeps it accessible for screen readers. The peer class lets sibling elements (the div and span) react to the state of the checkbox. When the checkbox is checked, the div changes color and the span moves to indicate the toggle state. (basically input(peer) - other elements can listen to the state of this input and change their styles accordingly)
//if checkbox is checked then bg-green-500 is applied to the div and the span is moved to the right by 4 units, creating a toggle switch effect. If unchecked, the div has a gray background and the span stays in its original position.
//full flow- initially publish is false, checkbox is unchecked and UI is gray background and circle on left. User clicks checkbox, browser check the checkbox on ui, setPublish(true), then publish becomes true, checkbox is now checked, tailwind reacts and peer-checked styles activate then UI becomes div background changes to green and circle moves to the right. If user clicks again, setPublish(false), publish becomes false, checkbox is unchecked, div background changes back to gray and circle moves back to the left.
//We arre basically using real checkbox(logic) + Fake UI(design) using peer ie checkbox is still there and works but you cant see it, instead you see the div and span which change based on the state of the checkbox. This is a common technique to create custom styled checkboxes or toggle switches while keeping them accessible.
//this checkbox = peer (reference point), if peer (checkbox) is checked then make this green and move circle to right
//checkbox is hidden but inside the label, clicking label meand clicking checkbox
//why this approach exists becuase default checkbox looks ugly thats why developers keep real checkbox (logic), hide it, build custom UI, sync using css (peer)

//Dont use onClick, use onChange for inputs becuase onClick fires when you click, doesnt guarantee value change, can misbehave with keyword and onChange fires when value actually changes ...onClick-user clicked, onChange-value changed 

//if you remove peer, then peer-checked has nothing to reference so checkbox still works but no ui styling