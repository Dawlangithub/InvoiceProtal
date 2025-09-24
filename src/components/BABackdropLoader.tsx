import BABox from "./BABox";
import BALoader from "./BALoader";

export default function BABackdropLoader({ loading = true }) {
    if (!loading) return null;
    return (
        <BABox
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(255,255,255,0.6)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <BALoader />
        </BABox>
    );
}
