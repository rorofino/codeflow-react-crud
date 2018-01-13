export const getData = () => {
    const fakeData = [];
    for (var i=0; i<1000; i++) {
        fakeData.push({
            id: i,
            name: 'Rodrigo '+i,
            lastName: 'Orofino'+i,
            createdAt: randomDate(new Date(1980, 0, 1), new Date(2000, 0, 1)).toLocaleDateString()
        });
    }
    return fakeData;
}

const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
