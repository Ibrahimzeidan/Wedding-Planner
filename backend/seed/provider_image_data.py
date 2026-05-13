POOLS = {
    "Wedding Hall": [
        "photo-1519167758481-83f550bb49b3", "photo-1464366400600-7168b8af9bc3",
        "photo-1523438885200-e635ba2c371e", "photo-1519225421980-715cb0215aed",
        "photo-1511795409834-ef04bbd61622", "photo-1469371670807-013ccf25f16a",
        "photo-1527529482837-4698179dc6ce", "photo-1505236858219-8359eb29e329",
    ],
    "Photographer": [
        "photo-1492691527719-9d1e07e534b4", "photo-1520854221256-17451cc331bf",
        "photo-1519741497674-611481863552", "photo-1511285560929-80b456fea0bc",
        "photo-1591604466107-ec97de577aff", "photo-1529634806980-85c3dd6d34ac",
        "photo-1519225421980-715cb0215aed", "photo-1523438885200-e635ba2c371e",
    ],
    "Catering": [
        "photo-1555244162-803834f70033", "photo-1546039907-7fa05f864c02",
        "photo-1511795409834-ef04bbd61622", "photo-1464366400600-7168b8af9bc3",
        "photo-1478145046317-39f10e56b5e9", "photo-1523438885200-e635ba2c371e",
        "photo-1504674900247-0877df9cc836", "photo-1504754524776-8f4f37790ca0",
    ],
    "Decoration": [
        "photo-1529634806980-85c3dd6d34ac", "photo-1519225421980-715cb0215aed",
        "photo-1511285560929-80b456fea0bc", "photo-1511795409834-ef04bbd61622",
        "photo-1464366400600-7168b8af9bc3", "photo-1469371670807-013ccf25f16a",
        "photo-1527529482837-4698179dc6ce", "photo-1505236858219-8359eb29e329",
    ],
    "Makeup Artist": [
        "photo-1487412947147-5cebf100ffc2", "photo-1522335789203-aabd1fc54bc9",
        "photo-1522336572468-97b06e8ef143", "photo-1516975080664-ed2fc6a32937",
        "photo-1526045478516-99145907023c", "photo-1509967419530-da38b4704bc6",
        "photo-1529626455594-4ff0802cfb7e", "photo-1517841905240-472988babdf9",
    ],
    "DJ / Music": [
        "photo-1516450360452-9312f5e86fc7", "photo-1493225457124-a3eb161ffa5f",
        "photo-1501386761578-eac5c94b800a", "photo-1470225620780-dba8ba36b745",
        "photo-1429962714451-bb934ecdc4ec", "photo-1506157786151-b8491531f063",
        "photo-1507874457470-272b3c8d8ee2", "photo-1533174072545-7a4b6ad7a6c3",
    ],
    "Dress Shop": [
        "photo-1594552072238-b8a33785b261", "photo-1595777457583-95e059d581b8",
        "photo-1469334031218-e382a71b716b", "photo-1515372039744-b8f02a3ae446",
        "photo-1483985988355-763728e1935b", "photo-1503342217505-b0a15ec3261c",
        "photo-1496747611176-843222e1e57c", "photo-1529139574466-a303027c1d8b",
    ],
    "Car Rental": [
        "photo-1503376780353-7e6692767b70", "photo-1525609004556-c46c7d6cf023",
        "photo-1549924231-f129b911e442", "photo-1492144534655-ae79c964c9d7",
        "photo-1502877338535-766e1452684a", "photo-1533473359331-0135ef1b58bf",
        "photo-1511918984145-48de785d4c4e", "photo-1541899481282-d53bffe3c35d",
    ],
    "Choreographer": [
        "photo-1519671482749-fd09be7ccebf", "photo-1508807526345-15e9b5f4eaff",
        "photo-1547153760-18fc86324498", "photo-1504609813442-a8924e83f76e",
        "photo-1524594152303-9fd13543fe6e", "photo-1545959570-a94084071b5d",
        "photo-1535525153412-5a42439a210d", "photo-1518611012118-696072aa579a",
    ],
}


def provider_image(category: str, index: int) -> str:
    pool = POOLS.get(category, POOLS["Wedding Hall"])
    image_id = pool[index % len(pool)]
    return f"https://images.unsplash.com/{image_id}?auto=format&fit=crop&w=900&q=80"
