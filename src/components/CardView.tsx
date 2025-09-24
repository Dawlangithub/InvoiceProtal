import BABox from "./BABox"

type ColumnConfig = {
    label: string,
    key: string,
}

type CardViewProps = {
    cols: ColumnConfig[],
    listData: Record<string, any>[],
}

const CardView = ({ cols, listData }: CardViewProps) => {
    const displayCols = Array.isArray(cols) ? cols.slice(0, 7) : [];
    const items = Array.isArray(listData) ? listData : [];

    const containerStyles: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16,
        alignItems: "stretch",
    };

    const cardStyles: React.CSSProperties = {
        background: "#ffffff",
        borderRadius: 12,
        border: "1px solid #eaeaea",
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    };

    const topBarStyles: React.CSSProperties = {
        height: 4,
        width: "100%",
        background: "linear-gradient(90deg, var(--primary), #8a63d2)",
    };

    const contentStyles: React.CSSProperties = {
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
    };

    const fieldsGridStyles: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 12,
    };

    const fieldBoxStyles: React.CSSProperties = {
        background: "#fafafa",
        border: "1px solid #eeeeee",
        borderRadius: 10,
        padding: 12,
        minHeight: 64,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    };

    const labelStyles: React.CSSProperties = {
        fontSize: 12,
        color: "#6b7280",
        letterSpacing: 0.2,
        marginBottom: 6,
        textTransform: "uppercase",
    };

    const valueStyles: React.CSSProperties = {
        fontSize: 16,
        color: "#111827",
        fontWeight: 600,
        wordBreak: "break-word",
    };

    return (
        <div style={containerStyles}>
            {items.map((item, itemIndex) => (
                <BABox key={itemIndex} sx={cardStyles}>
                    <BABox sx={topBarStyles} />
                    <BABox sx={contentStyles}>
                        <BABox sx={fieldsGridStyles}>
                            {displayCols.map((col, colIndex) => (
                                <BABox key={colIndex} sx={fieldBoxStyles}>
                                    <div style={labelStyles}>{col.label}</div>
                                    <div style={valueStyles}>{item?.[col.key] ?? "-"}</div>
                                </BABox>
                            ))}
                        </BABox>
                    </BABox>
                </BABox>
            ))}
        </div>
    )
}

export default CardView