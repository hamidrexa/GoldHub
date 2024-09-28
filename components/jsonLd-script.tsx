export function JsonLdScript({ jsonLdData }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(jsonLdData),
            }}
        />
    );
}
