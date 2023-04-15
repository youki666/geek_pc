import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";
import "./index.scss";

import { http } from "@/utils";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { useState, useEffect, useRef } from "react";

const { Option } = Select;

const Publish = () => {
  //const { channelStore } = useStore();
  const cacheImgList = useRef([]);
  // 获取频道列表
  const [channels, setChannels] = useState([]);
  useEffect(() => {
    async function fetchChannels() {
      const res = await http.get("/channels");
      setChannels(res.data.channels);
    }
    fetchChannels();
  }, []);
  const [fileList, setFileList] = useState([]);
  // 切换图片
  const [imgCount, setImageCount] = useState(1);
  const onFinish = async (values) => {
    // 数据的二次处理 重点是处理cover字段
    const { channel_id, content, title, type } = values;
    const params = {
      channel_id,
      content,
      title,
      type,
      cover: {
        type: type,
        images: fileList.map((item) => item.url),
      },
    };

    if (id) {
      await http.put(`/mp/articles/${id}?draft=false`, params);
      message.success("更新成功");
    } else {
      await http.post("/mp/articles?draft=false", params);
      message.success("发布成功");
      form.resetFields();
      setFileList([]);
    }
  };
  // 上传成功回调
  const onUploadChange = (info) => {
    const fileList = info.fileList.map((file) => {
      if (file.response) {
        return {
          url: file.response.data.url,
        };
      }
      return file;
    });
    console.log(fileList);
    setFileList(fileList);
  };

  const radioChange = (e) => {
    // 这里要使用e.target.value做判断
    const rawValue = e.target.value;
    setImageCount(rawValue);
    // 无图模式
    if (cacheImgList.current.length === 0) {
      return false;
    }
    // 单图模式
    if (rawValue === 1) {
      const img = cacheImgList.current[0];
      setFileList([img]);
      // 多图模式
    } else if (rawValue === 3) {
      setFileList(cacheImgList.current);
    }
  };
  // 编辑功能
  // 文案适配  路由参数id 判断条件
  const [params] = useSearchParams();
  const id = params.get("id");
  // 数据回填  id调用接口  1.表单回填 2.暂存列表 3.Upload组件fileList
  const [form] = Form.useForm();
  useEffect(() => {
    //channelStore.loadChannelList();
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${id}`);
      const data = res.data;
      // 表单数据回填
      form.setFieldsValue({ ...data, type: data.cover.type });
      // 回填upload
      const formatImgList = data.cover.images.map((url) => ({ url }));
      setFileList(formatImgList);
      // 暂存列表里也存一份
      cacheImgList.current = formatImgList;
      // 图片type
      setImageCount(data.cover.type);
    };
    // 必须是编辑状态 才可以发送请求
    if (id) {
      loadDetail();
    }
  }, [id, form]);
  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>发布文章</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入文章标题" }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: "请选择文章频道" }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channels.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={radioChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imgCount > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                action="http://geek.itheima.net/v1_0/upload"
                fileList={fileList}
                onChange={onUploadChange}
                maxCount={imgCount}
                multiple={imgCount > 1}
                showUploadList
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: "请输入文章内容" }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {id ? "更新" : "发布"}文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Publish;
