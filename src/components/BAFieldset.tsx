

export default function BAFieldset({ title, body }: { title: string; body: React.ReactNode }) {
    return (
        <fieldset className="rounded-lg bg-white p-2">
            <legend className="rounded-lg p-2 mb-2 px-4 bg-gray-700 text-white">{title}</legend>
            {body}
        </fieldset>
    );
}