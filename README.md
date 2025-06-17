# Numerical Methods for Wound Healing PDE: A Comprehensive Analysis

## Problem Statement

We consider the wound healing partial differential equation (PDE) with nonlinear diffusion and logistic growth:

$$
\frac{\partial u}{\partial t} = D \frac{\partial}{\partial r} \left( \left(1 - \frac{u}{u_0}\right)^p \frac{\partial u}{\partial r} \right) + s_c u \left(1 - \frac{u}{u_0}\right)
$$

Where:

- **\( u(r,t) \)**: Cell density (cells/cm³)
- **\( r \)**: Spatial coordinate (cm), \( 0 \leq r \leq r_0 \)
- **\( t \)**: Time (seconds)
- **\( u_0 \)**: Carrying capacity (normalized to 1)
- **\( r_0 \)**: Wound half-width (0.5 cm)
- **\( D \)**: Cell diffusivity (\( 2.0 \times 10^{-9} \) cm²/s)
- **\( p \)**: Nonlinear diffusion exponent (0, 1, or 5)
- **\( s_c \)**: Proliferation rate (0 or \( 8.0 \times 10^{-6} \) s⁻¹)

### Initial Condition

$$
u(r,0) = 0 \quad \text{for} \quad r > 0
$$

### Boundary Conditions

- **Dirichlet condition** at \( r=0 \): \( u(0,t) = u_0 = 1 \)
- **Neumann condition** at \( r=r_0 \): \( \frac{\partial u}{\partial r}(r_0,t) = 0 \)

---

## Analytical Solution (Special Case: \( p = 0, \ s_c = 0 \))

In this case, the PDE reduces to the heat equation:

$$
\frac{\partial u}{\partial t} = D \frac{\partial^2 u}{\partial r^2}
$$

We decompose the solution as \( u(r,t) = u_s(r) + v(r,t) \), where \( u_s(r) = 1 \) is the steady-state solution. Then:

- \( v(r,t) = u(r,t) - 1 \)
- \( \frac{\partial v}{\partial t} = D \frac{\partial^2 v}{\partial r^2} \)
- \( v(0,t) = 0 \)
- \( \frac{\partial v}{\partial r}(r_0,t) = 0 \)
- \( v(r,0) = -1 \)

Using separation of variables, the eigenfunctions are:

$$
R_m(r) = \sin\left( \frac{(2m-1)\pi r}{2r_0} \right), \quad \lambda_m = \frac{(2m-1)\pi}{2r_0}
$$

With time decay:

$$
T_m(t) = e^{-D \lambda_m^2 t}
$$

Fourier coefficients from \( v(r,0) = -1 \) yield:

$$
c_m = -\frac{4}{(2m - 1)\pi}
$$

### Final Analytical Solution:

$$
u(r,t) = 1 - \sum_{m=1}^{\infty} \frac{4}{(2m-1)\pi} \exp\left(-D \left( \frac{(2m-1)\pi}{2r_0} \right)^2 t \right) \sin\left( \frac{(2m-1)\pi r}{2r_0} \right)
$$

---

## Numerical Methods

### Explicit Finite Difference (Forward Euler)

#### Discretization

Time derivative:

$$
\frac{\partial u}{\partial t} \approx \frac{u_i^{n+1} - u_i^n}{\Delta t}
$$

Spatial second derivative:

$$
\frac{\partial^2 u}{\partial r^2} \approx \frac{u_{i+1}^n - 2u_i^n + u_{i-1}^n}{(\Delta r)^2}
$$

Gradient squared (used in nonlinear term):

$$
\left( \frac{\partial u}{\partial r} \right)^2 \approx \left( \frac{u_{i+1}^n - u_{i-1}^n}{2\Delta r} \right)^2
$$

#### Update Rule

For interior points \( i = 2,\dots,N-1 \):

$$
\begin{aligned}
u_i^{n+1} = u_i^n + \Delta t \bigg[ & D \Bigg( \left(1 - \frac{u_i^n}{u_0}\right)^p \frac{u_{i+1}^n - 2u_i^n + u_{i-1}^n}{(\Delta r)^2} \\
& - \frac{p}{u_0} \left(1 - \frac{u_i^n}{u_0}\right)^{p-1} \left( \frac{u_{i+1}^n - u_{i-1}^n}{2\Delta r} \right)^2 \Bigg) \\
& + s_c u_i^n \left(1 - \frac{u_i^n}{u_0} \right) \bigg]
\end{aligned}
$$

#### Boundary Conditions

- \( u_1^{n+1} = 1 \) (Dirichlet)
- \( u_N^{n+1} = u_{N-1}^{n+1} \) (Neumann)

#### Stability Condition

$$
\Delta t \leq \frac{(\Delta r)^2}{2D}
$$

---

### Implicit Finite Difference (Backward Euler)

Nonlinear update equation:

$$
\frac{u_i^{n+1} - u_i^n}{\Delta t} = D \left[ \left(1 - \frac{u_i^{n+1}}{u_0} \right)^p \frac{u_{i+1}^{n+1} - 2u_i^{n+1} + u_{i-1}^{n+1}}{(\Delta r)^2} - \frac{p}{u_0} \left(1 - \frac{u_i^{n+1}}{u_0} \right)^{p-1} \left( \frac{u_{i+1}^{n+1} - u_{i-1}^{n+1}}{2\Delta r} \right)^2 \right] + s_c u_i^{n+1} \left(1 - \frac{u_i^{n+1}}{u_0} \right)
$$

This nonlinear system is solved via Newton-Raphson.

---

### Crank-Nicolson Method

Second-order accurate in time:

$$
\begin{aligned}
\frac{u_i^{n+1} - u_i^n}{\Delta t} = \frac{1}{2} \Big[ & D \left( \left(1 - \frac{u_i^n}{u_0} \right)^p \frac{u_{i+1}^n - 2u_i^n + u_{i-1}^n}{(\Delta r)^2} - \frac{p}{u_0} \left(1 - \frac{u_i^n}{u_0} \right)^{p-1} \left( \frac{u_{i+1}^n - u_{i-1}^n}{2\Delta r} \right)^2 \right) \\
& + s_c u_i^n \left(1 - \frac{u_i^n}{u_0} \right) \Big] + \text{same terms at } n+1
\end{aligned}
$$

Also solved with Newton-Raphson.

---

### Method of Lines (MOL)

#### Spatial Discretization

Grid: \( r_i = (i-1)\Delta r \), \( \Delta r = r_0 / (N-1) \), and \( u_i(t) = u(r_i, t) \)

Interior points:

$$
\frac{du_i}{dt} = D \left[ \left(1 - \frac{u_i}{u_0} \right)^p \frac{u_{i+1} - 2u_i + u_{i-1}}{(\Delta r)^2} - \frac{p}{u_0} \left(1 - \frac{u_i}{u_0} \right)^{p-1} \left( \frac{u_{i+1} - u_{i-1}}{2\Delta r} \right)^2 \right] + s_c u_i \left(1 - \frac{u_i}{u_0} \right)
$$

Boundary conditions:

- \( u_1(t) = 1 \)
- \( u_N(t) = u_{N-1}(t) \)

Solve ODE system with a stiff solver (e.g. BDF, implicit Runge-Kutta).

---

### Finite Element Method (FEM)

#### Weak Formulation

Let \( v(r) \) be a test function. Then:

$$
\int_0^{r_0} \frac{\partial u}{\partial t} v \, dr + \int_0^{r_0} D \left(1 - \frac{u}{u_0} \right)^p \frac{\partial u}{\partial r} \frac{\partial v}{\partial r} \, dr = \int_0^{r_0} s_c u \left(1 - \frac{u}{u_0} \right) v \, dr
$$

#### Galerkin Discretization

Use basis functions \( \phi_i(r) \) with \( u_h(r,t) = \phi_1(r) + \sum_{j=2}^N u_j(t) \phi_j(r) \)

Then, the semi-discrete system:

$$
M \frac{d\mathbf{u}}{dt} + K(\mathbf{u}) \mathbf{u} = \mathbf{f}(\mathbf{u})
$$

Where:

- \( M \): Mass matrix
- \( K(\mathbf{u}) \): Nonlinear stiffness matrix
- \( \mathbf{f}(\mathbf{u}) \): Nonlinear reaction vector

#### Time Discretization (Backward Euler)

Fully discrete nonlinear system:

$$
\mathbf{G}(\mathbf{u}^{n+1}) = M \mathbf{u}^{n+1} + \Delta t K(\mathbf{u}^{n+1}) \mathbf{u}^{n+1} - \Delta t \mathbf{f}(\mathbf{u}^{n+1}) - M \mathbf{u}^n = \mathbf{0}
$$

Solve using Newton-Raphson.

---

## Summary of Methods

| Method                 | Time Accuracy            | Space Accuracy         | Stability           | Nonlinear Handling | Use Case                  |
|------------------------|--------------------------|-------------------------|----------------------|--------------------|----------------------------|
| Explicit Euler         | First-order (\( O(\Delta t) \)) | Second-order (\( O(\Delta r^2) \)) | Conditional (\( \Delta t \leq \frac{(\Delta r)^2}{2D} \)) | Explicit           | Simple problems, small time |
| Implicit Euler         | First-order              | Second-order            | Unconditionally stable | Newton-Raphson     | Stiff systems, large time  |
| Crank-Nicolson         | Second-order             | Second-order            | Unconditionally stable | Newton-Raphson     | Higher accuracy, stiff     |
| Method of Lines        | ODE solver dependent     | Second-order            | Solver dependent      | Built-in (e.g., BDF) | Adaptive time stepping     |
| Finite Element Method  | Depends on basis         | Depends on basis        | Unconditionally stable | Newton-Raphson     | Complex geometries         |

---

## References

- Mainardi, F. (2010). *Fractional Calculus and Waves in Linear Viscoelasticity*.
- Smith, G. D. (1985). *Numerical Solution of Partial Differential Equations: Finite Difference Methods*.
- Logg, A., Mardal, K.-A., Wells, G. (2012). *Automated Solution of Differential Equations by the Finite Element Method*.
