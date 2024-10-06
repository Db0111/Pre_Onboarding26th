import MOCK_DATA from "./MockData";
interface MockData {
  productId: string;
  productName: string;
  price: number;
  boughtDate: string;
}

const PER_PAGE = 10;

// 페이지는 1부터 시작함
export const getMockData = (pageNum: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const datas: MockData[] = MOCK_DATA.slice(
        PER_PAGE * pageNum,
        PER_PAGE * (pageNum + 1)
      );
      const isEnd = PER_PAGE * (pageNum + 1) >= MOCK_DATA.length;

      resolve({ datas, isEnd });
    }, 1500);
  });
};
