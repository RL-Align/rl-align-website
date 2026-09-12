git clone https://github.com/RL-Align/RL-Kernel.git
cd RL-Kernel

# AMD gfx942: MI300A, MI300X, MI325X
PYTORCH_ROCM_ARCH=gfx942 python3 setup.py develop

# Verify the ROCm environment and native extension.
python3 scripts/check_rocm_env.py
python3 -c "import torch, rl_engine._C as C; \
print('GPU:', torch.cuda.get_device_name(0)); \
print('HIP:', torch.version.hip); \
print('Extension:', C.__file__); assert hasattr(C, 'fused_logp')"
