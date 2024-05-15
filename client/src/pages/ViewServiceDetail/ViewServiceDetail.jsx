export const ViewServiceDetail = () => {
  const viewInfo = [
    { name: "Chi tiết công việc" },
    { name: "Chọn vị trí làm việc" },
    { name: "Lựa chọn chi tiết" },
    { name: "Lựa chọn thời gian và thông tin liên hệ" },
  ];

  return (
    <>
      <div className="w-full px-20">
        {/* 5 bước xác nhận thông tin */}
        <div className="">
          {/* Nút */}
          <ul className="relative flex flex-row gap-x-2 px-10">
            {viewInfo.map((info, index) => {
              return (
                <li className="shrink basis-0 flex-1 group">
                  <div className="min-w-10 min-h-10 w-full inline-flex items-center text-xs align-middle">
                    <span className="size-10 flex justify-center items-center flex-shrink-0 bg-primary font-medium text-white rounded-full">
                      {index + 1}
                    </span>
                    <div className="ms-2 w-full h-px flex-1 bg-gray group-last:hidden"></div>
                  </div>
                  <div className="mt-3">
                    <span className="block text-sm font-medium text-gray">
                      {info.name}
                    </span>
                  </div>
                </li>
              );
            })}
            <li className="shrink basis-0 group">
              <div className="min-w-10 min-h-10 w-full inline-flex items-center text-xs align-middle">
                <span className="size-10 flex justify-center items-center flex-shrink-0 bg-primary font-medium text-white rounded-full">
                  5
                </span>
                <div className="ms-2 w-full h-px flex-1 bg-gray group-last:hidden"></div>
              </div>
              <div className="mt-3">
                <span className="block text-sm font-medium text-gray">
                  Xác nhận
                </span>
              </div>
            </li>
          </ul>
        </div>

        {/* Chi tiết dịch vụ */}
        <div className="flex relative gap-x-10 mt-10 mx-40">
          {/* Ảnh */}
          <div className="flex-1">
            <img
              className="rounded-lg"
              src="https://cdn.tgdd.vn/Files/2014/04/16/542288/cach-ve-sinh-may-giat-cua-truoc-3.jpg"
            />
          </div>
          {/* Chi tiết */}
          <div className="flex-1">
            {/* Tên Dịch Vụ */}
            <div className="mb-6 font-bold text-primary text-lg">
              Dịch vụ vệ sinh máy giặt
            </div>
            {/* Mô Tả dịch vụ */}
            <div>
              Đối với máy giặt có chế độ vệ sinh lồng giặt thì bạn mở nguồn,
              chọn nút chức năng vệ sinh lồng giặt và nhấn nút khởi động để kích
              hoạt. Bạn có thể cho thêm các chất tẩy rửa như: baking soda, giấm,
              cốt chanh,... để tăng cường khả năng làm sạch vi khuẩn, nấm mốc
              trong lồng giặt. Nếu máy giặt không có chế độ này, bạn thực hiện
              vệ sinh lồng giặt bằng cách đổ giấm 1 cốc giấm trắng hoặc dung
              dịch pha từ nước và muối vào bên trong lồng giặt. Sau đó cho một
              ít bột baking soda vào ngăn chứa bột giặt, kích hoạt cho máy chạy
              ở chế độ ngâm từ 15 - 20 phút.{" "}
            </div>
          </div>
        </div>

        {/* Nút tiếp theo */}
        <div className="flex items-center justify-center">
          <button className="mt-10 w-[500px] py-3 bg-primary rounded-full text-white hover:opacity-70">
            Tiếp theo
          </button>
        </div>
      </div>
    </>
  );
};
