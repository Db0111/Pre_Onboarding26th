import React, { useState, useEffect, useRef, useCallback } from "react";
import { getMockData } from "./getMockData";
import { BeatLoader } from "react-spinners";
import "./MainPage.css";
interface MockData {
  productId: string;
  productName: string;
  price: number;
  boughtDate: string;
}

const InfiniteScroll: React.FC = () => {
  const [data, setData] = useState<MockData[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [totalPriceSum, setTotalPriceSum] = useState(0); // 전체 가격 합계 상태

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { datas, isEnd }: any = await getMockData(pageNum - 1);
      setData((prevData) => {
        const newData = [...prevData, ...datas];

        // 새로 가져온 데이터의 가격 합계를 계산하여 totalPriceSum에 반영
        const newPriceSum = datas.reduce(
          (sum: number, item: MockData) => sum + item.price,
          0
        );

        setTotalPriceSum((prevSum) => prevSum + newPriceSum); // 전체 가격 합계 업데이트
        return newData;
      });
      setIsEnd(isEnd);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [pageNum]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && !isEnd) {
        setPageNum((prevPageNum) => prevPageNum + 1);
      }
    },
    [loading, isEnd]
  );

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });

    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [handleObserver]);

  return (
    <div>
      <h2>Product List</h2>
      <div className="product-list">
        {data.map((item) => (
          <div key={item.productId} className="product-item">
            <p>상품명: {item.productName}</p>
            <p>가격: ${item.price}</p>
            <p>
              구매일자:{" "}
              {new Date(item.boughtDate).toLocaleString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
      {/* 가져온 모든 상품들의 가격 총 합계 */}
      <h3>현재까지 가져온 상품들의 총 가격 합계: ${totalPriceSum}</h3>{" "}
      {loading && <BeatLoader />}
      {isEnd && <p>여기가 마지막 입니다!</p>}
      {!isEnd && (
        <div
          ref={lastElementRef}
          style={{ height: "20px", background: "transparent" }}
        />
      )}
    </div>
  );
};

export default InfiniteScroll;
